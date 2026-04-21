from imapclient import IMAPClient
import pyzmail

HOST = "imap.gmail.com"
USERNAME = "your gmail"
PASSWORD = "your password"

def read_latest():
    server = IMAPClient(HOST)
    server.login(USERNAME,PASSWORD)
    server.select_folder("INBOX")

    messages = server.search()

    if len(messages) == 0:
        server.logout()
        return None,None
    else:
        last_uid = messages[-1]
        raw_text_content = server.fetch([last_uid],["BODY[]"])
        text_content = pyzmail.PyzMessage.factory(
            raw_text_content[last_uid][b"BODY[]"]
        )
        subject = text_content.get_subject()
        
        body = ""
        if text_content.text_part:
            body = text_content.text_part.get_payload().decode(
                text_content.text_part.charset or 'utf-8', errors='ignore'
            )
        elif text_content.html_part:
             body = text_content.html_part.get_payload().decode(
                text_content.html_part.charset or 'utf-8', errors='ignore'
            )
            
        server.logout()
    return subject,body

def read_recent_emails(n=20):
    try:
        server = IMAPClient(HOST)
        server.login(USERNAME,PASSWORD)
        server.select_folder("INBOX")

        messages = server.search()
        
        if not messages:
            server.logout()
            return []

        # Get last n messages
        messages = messages[-n:] if len(messages) > n else messages
        
        # Batch fetch
        response = server.fetch(messages, ["BODY[]", "INTERNALDATE"])
        
        email_data = []
        
        for uid in messages:
            try:
                data = response[uid]
                msg = pyzmail.PyzMessage.factory(data[b"BODY[]"])
                subject = msg.get_subject()
                sender = msg.get_address('from')
                sender_str = f"{sender[0]} <{sender[1]}>" if sender else "Unknown"
                
                # Extract date
                date_obj = data.get(b"INTERNALDATE")
                
                body = ""
                if msg.text_part:
                    body = msg.text_part.get_payload().decode(msg.text_part.charset or 'utf-8', errors='ignore')
                elif msg.html_part:
                    body = msg.html_part.get_payload().decode(msg.html_part.charset or 'utf-8', errors='ignore')
                
                email_data.append({
                    'subject': subject,
                    'sender': sender_str,
                    'body': body,
                    'date': date_obj # datetime object from imapclient
                })
            except Exception as e:
                print(f"Error parsing email {uid}: {e}")
                continue

        server.logout()
        return list(reversed(email_data)) # Newest first
    except Exception as e:
        print(f"Connection Error: {e}")
        return []
