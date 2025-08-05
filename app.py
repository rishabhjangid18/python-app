from flask import Flask
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def hello():
    current_hour = datetime.now().hour

    if current_hour < 12:
        greeting = "Good morning ☀️"
    elif current_hour < 18:
        greeting = "Good afternoon 🌤️"
    else:
        greeting = "Good evening 🌙"

    return f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Welcome to Flask</title>
        <style>
            body {{
                background: linear-gradient(to right, #e0eafc, #cfdef3);
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                text-align: center;
                padding: 50px;
                color: #333;
            }}
            h1 {{
                font-size: 3em;
                color: #2c3e50;
            }}
            p {{
                font-size: 1.5em;
            }}
            button {{
                margin-top: 30px;
                padding: 10px 20px;
                font-size: 1em;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }}
            button:hover {{
                background-color: #45a049;
            }}
            .fact {{
                margin-top: 20px;
                font-style: italic;
                color: #555;
            }}
        </style>
    </head>
    <body>
        <h1>{greeting}</h1>
        <p>Hello, welcome to this Flask app! from <b>dev</b> branch</p>
        <p class="fact">Did you know? Flask is named after a Python micro web framework that's small but mighty!</p>
        <button onclick="alert('Thanks for clicking! 😄')">Click Me</button>
    </body>
    </html>
    '''

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000)
