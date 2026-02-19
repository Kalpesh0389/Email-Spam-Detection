from flask import * 
from flask_cors import CORS 
import spacy
from pickle import load
from reader import read_latest, read_recent_emails
from datetime import datetime
from collections import Counter, defaultdict
import re

# Load models
# Try loading sm if lg fails or just stick to what was there. 
# The user had lg loaded in the file I read. Keep it but be careful with memory.
try:
    nlp = spacy.load("en_core_web_lg")
except:
    nlp = spacy.load("en_core_web_sm")

f = open("model.pkl","rb")
model = load(f)
f.close()
f = open("vector.pkl","rb")
tv = load(f)
f.close()

SPAM_KEYWORDS = [
    "free", "winner", "urgent", "click", "risk", "prize", "claim",
    "offer", "limited", "exclusive", "act now", "apply now", "bonus",
    "cash", "cheap", "deal", "discount", "expire", "instant", "investment",
    "loan", "money", "now", "obligation", "order", "password", "profit",
    "promo", "purchase", "rates", "refund", "reward", "save", "scam",
    "security", "service", "subscribe", "terms", "traffic", "trial",
    "unlimited", "unsubscribe", "verification", "warranty", "win",
    "lottery", "crypto", "bitcoin", "bank", "account", "suspended"
]

def clean_function(text):
    # Safeguard: truncate text for heavy NLP operations
    if len(text) > 5000:
        text = text[:5000]
        
    text = text.lower()
    doc = nlp(text)
    
    # Efficient list comprehension
    tokens = [t.lemma_ for t in doc if not t.is_punct and not t.is_stop]
    return " ".join(tokens)

def process_email_analysis(email_body):
    # Truncate for display and analysis
    if len(email_body) > 3000:
        email_body = email_body[:3000] + "... (truncated)"
        
    doc = nlp(email_body)
    
    # 1. Entity Extraction
    entities = []
    target_labels = ["ORG", "MONEY", "GPE", "DATE", "CARDINAL", "PRODUCT", "FAC", "LOC"]
    seen_entities = set()
    
    for ent in doc.ents:
        if ent.label_ in target_labels:
            key = (ent.text, ent.label_)
            if key not in seen_entities:
                entities.append({"label": ent.label_, "text": ent.text})
                seen_entities.add(key)
    
    # 2. Key Phrase Highlighting
    highlighted_body = email_body
    # Escape HTML to prevent injection if we were rendering user content, 
    # but here we are injecting our own HTML tags. 
    # Ideally use a library but simple replace is okay for this demo.
    
    found_keywords = set()
    lower_body = email_body.lower()
    
    for keyword in SPAM_KEYWORDS:
        if keyword in lower_body:
            # Use regex to find and replace while preserving case
            # This regex matches the keyword as a whole word boundary
            pattern = re.compile(r'\b' + re.escape(keyword) + r'\b', re.IGNORECASE)
            if pattern.search(email_body):
                found_keywords.add(keyword)
                highlighted_body = pattern.sub(f'<span class="spam-highlight">{keyword}</span>', highlighted_body)
            
    return sorted(entities, key=lambda x: x['label']), highlighted_body, sorted(list(found_keywords))

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def serialize_date(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    return obj

def get_email_context():
    emails = read_recent_emails(n=50) # Updated to 50 for better stats
    
    analyzed_emails = []
    spam_count = 0
    ham_count = 0
    sender_spam_count = Counter()
    
    spotlight_email = None
    
    if emails:
        for email in emails:
            # 1. Prediction using the model
            # Clean and Transform
            raw_body = email['body'] or ""
            safe_len_body = raw_body[:5000] # Safe length for vectorizer
            
            clean_body = clean_function(safe_len_body)
            vector_body = tv.transform([clean_body])
            
            result_label = model.predict(vector_body)[0]
            
            is_spam = str(result_label).lower() == "spam" or result_label == 1
            label = "Spam" if is_spam else "Ham"
            
            if is_spam:
                spam_count += 1
                sender_spam_count[email['sender']] += 1
            else:
                ham_count += 1
                
            email_data = {
                'subject': email['subject'],
                'sender': email['sender'],
                'body': raw_body, 
                'label': label,
                'is_spam': is_spam,
                'date': email.get('date')
            }
            
            analyzed_emails.append(email_data)
            
            # Select Spotlight Email: First detected SPAM
            if is_spam and spotlight_email is None:
                entities, highlighted, keywords = process_email_analysis(raw_body)
                spotlight_email = {
                    **email_data,
                    "entities": entities,
                    "highlighted_body": highlighted,
                    "keywords": keywords
                }
    
    # Fallback: if no spam found, spotlight the first email
    if spotlight_email is None and analyzed_emails:
        email = analyzed_emails[0]
        entities, highlighted, keywords = process_email_analysis(email['body'])
        spotlight_email = {
            **email,
            "entities": entities,
            "highlighted_body": highlighted,
            "keywords": keywords
        }

    # Prepare chart data
    total_emails = spam_count + ham_count
    
    spam_vs_ham_data = {
        'labels': ['Spam', 'Not Spam'],
        'data': [spam_count, ham_count]
    }
    
    # helper for sorting months
    def month_key(m_str):
        return datetime.strptime(m_str, "%b %Y")

    # Aggregate by month
    monthly_spam = defaultdict(int)
    monthly_ham = defaultdict(int)
    all_months = set()

    for em in analyzed_emails:
        if em.get('date'):
            # Format: 'Jan 2024'
            try:
                m_str = em['date'].strftime("%b %Y")
                all_months.add(m_str)
                if em['is_spam']:
                    monthly_spam[m_str] += 1
                else:
                    monthly_ham[m_str] += 1
            except Exception:
                continue
    
    # Sort months chronologically
    sorted_months = sorted(list(all_months), key=month_key)
    
    monthly_data = {
        'labels': sorted_months,
        'datasets': [
            {
                'label': 'Spam',
                'data': [monthly_spam[m] for m in sorted_months],
                # Colors will be handled in frontend, but we can pass basics here if needed
            },
            {
                'label': 'Safe (Ham)',
                'data': [monthly_ham[m] for m in sorted_months]
            }
        ]
    }
    
    # Serialize dates in emails and spotlight
    for em in analyzed_emails:
        if em.get('date'):
             em['date'] = serialize_date(em['date'])
             
    if spotlight_email and spotlight_email.get('date'):
        spotlight_email['date'] = serialize_date(spotlight_email['date'])

    return {
        'emails': analyzed_emails,
        'stats': {'total': total_emails, 'spam': spam_count, 'ham': ham_count},
        'chart_data': {'spam_vs_ham': spam_vs_ham_data, 'monthly_data': monthly_data},
        'spotlight': spotlight_email
    }

@app.route("/dashboard")
def dashboard():
    # Only useful if we still want to serve the old template, but we are moving to React.
    # We can keep it for now.
    context = get_email_context()
    return render_template("dashboard.html", **context)

@app.route("/api/dashboard-data")
def dashboard_data():
    context = get_email_context()
    return jsonify(context)


@app.route("/check-recent")
def check():
    subject, body = read_latest()
    if not body:
         return render_template("home.html", result="No Emails Found", body="Check connection or inbox empty")

    clean_body = clean_function(body[:5000]) # Safe trunc
    vector_body = tv.transform([clean_body])

    result = model.predict(vector_body)
    result = result[0]
    if str(result).lower() == "ham":
        result = "Not Spam"
    return render_template("home.html", result=result, body=body)

@app.route("/", methods=["GET","POST"])
def home():
    if request.method == "POST":
        text = request.form.get("text")
        clean_text = clean_function(text[:5000])
        vector_text = tv.transform([clean_text])
        result = model.predict(vector_text)
        result = result[0]
        if str(result).lower() == "ham":
            result = "Not Spam"
        return render_template("home.html", result=result, body=text) # Pass body back to keep text in area
    else:
        return render_template("home.html", body="")

@app.route("/api/analyze", methods=["POST"])
def analyze_email_api():
    try:
        data = request.json
        text = data.get('text', '')
        
        # Reuse existing cleanup and analysis logic
        clean_text = clean_function(text[:5000])
        vector_text = tv.transform([clean_text])
        prediction = model.predict(vector_text)[0]
        
        is_spam = str(prediction).lower() == "spam" or prediction == 1
        
        entities, highlighted_body, keywords = process_email_analysis(text)
        
        return jsonify({
            "status": "success",
            "is_spam": bool(is_spam),
            "entities": entities,
            "highlighted_body": highlighted_body,
            "keywords": keywords
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/api/check-recent", methods=["GET"])
def check_recent_api():
    try:
        subject, body = read_latest()
        if not body:
             return jsonify({"status": "error", "message": "No Emails Found"}), 404

        clean_body = clean_function(body[:5000])
        vector_body = tv.transform([clean_body])

        result_label = model.predict(vector_body)[0]
        # Ensure boolean serializable
        is_spam = str(result_label).lower() == "spam" or result_label == 1
        
        entities, highlighted_body, keywords = process_email_analysis(body)
        
        return jsonify({
            "status": "success",
            "subject": subject,
            "body": body,
            "is_spam": bool(is_spam),
            "entities": entities,
            "highlighted_body": highlighted_body,
            "keywords": keywords
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, use_reloader=True)
