"""
Sample Run / Test Script for Experiment 5
Tests Automated Legal Document Analyzer on sample contracts.
"""

import os
from legal_engine import analyze_legal_document, BASE_DIR

def run_test():
    print("=" * 70)
    print("EXPERIMENT 5: Automated Legal Document Analyzer using GPT-4 / Ollama")
    print("=" * 70)

    sample_path = os.path.join(BASE_DIR, "sample_contracts", "employment_agreement.txt")
    with open(sample_path, "r", encoding="utf-8") as f:
        contract_text = f.read()

    print(f"\n[+] Loaded Sample Contract ({len(contract_text)} chars)")
    print("--------------------------------------------------")
    print(contract_text[:300] + "...\n[truncated]")
    print("--------------------------------------------------")

    print("\n[+] Running Preprocessing, Prompting & Analysis Pipeline...")
    res = analyze_legal_document(contract_text, doc_type_hint="Employment Agreement")
    a = res["analysis"]

    print(f"\n[+] Inference Engine: {res['engine']}")
    print(f"[+] Executive Summary:\n    {a['executive_summary']}")
    print(f"[+] Document Type: {a['document_type']}")
    print(f"[+] Parties: {', '.join(a['parties_involved'])}")
    print(f"[+] Purpose: {a['purpose']}")
    print(f"[+] Obligations:")
    for o in a['obligations']:
        print(f"    - {o}")
    print(f"[+] Rights: {a['rights']}")
    print(f"[+] Payment Terms: {a['payment_terms']}")
    print(f"[+] Duration / Term: {a['duration_term']}")
    print(f"[+] Termination: {a['termination_conditions']}")
    print(f"[+] Confidentiality: {a['confidentiality']}")
    print(f"[+] Important Dates: {a['important_dates']}")
    print(f"[+] Governing Law: {a['governing_law']}")

    print("\n[✓] Experiment 5 test completed successfully!\n")

if __name__ == "__main__":
    run_test()
