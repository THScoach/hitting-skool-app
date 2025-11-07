from datetime import datetime

from flask import Flask

app = Flask(__name__)


@app.route("/")
def home():
    current_year = datetime.now().year
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>The Hitting Skool Timing Model</title>
        <style>
            :root {{
                font-family: "Helvetica Neue", Arial, sans-serif;
                color: #0f172a;
                background-color: #f8fafc;
            }}
            body {{
                margin: 0;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
            }}
            main {{
                flex: 1;
                max-width: 960px;
                padding: 3rem 1.5rem 2rem;
                margin: 0 auto;
            }}
            header {{
                text-align: center;
                margin-bottom: 2rem;
            }}
            h1 {{
                font-size: 2.5rem;
                margin-bottom: 0.5rem;
            }}
            .results {{
                background: white;
                border-radius: 12px;
                padding: 2rem;
                box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
                margin-bottom: 1.5rem;
            }}
            .results h2 {{
                font-size: 1.5rem;
                margin-top: 0;
            }}
            .results-details {{
                margin: 1rem 0;
                line-height: 1.6;
            }}
            .results-note {{
                font-size: 0.85rem;
                color: #475569;
                background: #e2e8f0;
                padding: 0.75rem;
                border-radius: 8px;
            }}
            footer {{
                text-align: center;
                font-size: 0.75rem;
                color: #475569;
                padding: 1rem 0;
            }}
        </style>
    </head>
    <body>
        <main>
            <header>
                <h1>The Hitting Skool Timing Model</h1>
                <p>Dial in your swing timing with data-driven estimation.</p>
            </header>
            <section class="results">
                <h2>Results</h2>
                <div class="results-details">
                    <p>Timing insights and recommendations will appear here once available.</p>
                </div>
                <p class="results-note">
                    This is an estimated timing model. It does not replace in-person coaching or full biomechanical reports.
                </p>
            </section>
        </main>
        <footer>
            © {current_year} The Hitting Skool. Built as a free starter tool.
        </footer>
    </body>
    </html>
    """


if __name__ == "__main__":
    app.run()
