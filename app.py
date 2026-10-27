"""
Ex. No.: 5 - Automated Legal Document Analyzer using GPT-4 / Ollama
Backend: Flask Application
"""

import os
from flask import Flask, render_template, request, jsonify
from legal_engine import analyze_legal_document, BASE_DIR

app = Flask(__name__)

SAMPLE_DIR = os.path.join(BASE_DIR, "sample_contracts")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/get_sample", methods=["GET"])
def get_sample():
    sample_name = request.args.get("name", "employment_agreement.txt")
    file_path = os.path.join(SAMPLE_DIR, sample_name)
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        return jsonify({"success": True, "filename": sample_name, "content": content})
    return jsonify({"success": False, "error": "Sample file not found."}), 404


@app.route("/analyze", methods=["POST"])
def handle_analyze():
    data = request.get_json() or {}
    text = data.get("text", "")
    doc_type = data.get("document_type", "Auto-detect")

    if not text.strip():
        return jsonify({"success": False, "error": "Document text is required."}), 400

    try:
        result = analyze_legal_document(text, doc_type)
        return jsonify({"success": True, "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/health")
def health():
    return jsonify({"status": "healthy", "service": "legal-analyzer"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5005))
    print(f"[*] Starting Legal Document Analyzer on http://127.0.0.1:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)
