from flask import Flask, jsonify, render_template

app = Flask(__name__)


@app.route('/test')
def test():
    return jsonify({'message': 'Hello react'})


if __name__ == '__main__':
    app.run(debug=True)
