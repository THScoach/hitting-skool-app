from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return '<h1>The Hitting Skool - Coming Soon!</h1><p>Your application is successfully deployed!</p>'

if __name__ == '__main__':
    app.run()
