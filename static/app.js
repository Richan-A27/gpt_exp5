let currentAnalysisJson = null;

async function loadSample() {
  try {
    const res = await fetch("/get_sample?name=employment_agreement.txt");
    const data = await res.json();
    if (data.success) {
      document.getElementById("doc-text").value = data.content;
      document.getElementById("doc-type").value = "Employment Agreement";
    }
  } catch (err) {
    alert("Could not load sample contract.");
  }
}

function clearInput() {
  document.getElementById("doc-text").value = "";
  document.getElementById("results-dashboard").style.display = "none";
}

async function analyzeDocument() {
  const text = document.getElementById("doc-text").value.trim();
  const docType = document.getElementById("doc-type").value;

  if (!text) {
    alert("Please enter or load legal contract text to analyze.");
    return;
  }

  const btn = document.getElementById("btn-analyze");
  const originalHtml = btn.innerHTML;
  btn.innerHTML = "<span>Analyzing Legal Contract...</span>";
  btn.disabled = true;

  try {
    const res = await fetch("/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: text,
        document_type: docType
      })
    });

    const data = await res.json();
    if (data.success) {
      renderAnalysis(data.data);
    } else {
      alert("Error: " + (data.error || "Analysis failed"));
    }
  } catch (err) {
    console.error(err);
    alert("Request failed. Ensure the server is running.");
  } finally {
    btn.innerHTML = originalHtml;
    btn.disabled = false;
  }
}

function renderAnalysis(data) {
  currentAnalysisJson = data.analysis;
  const a = data.analysis;

  document.getElementById("engine-tag").textContent = `Extracted strictly using ${data.engine}`;
  document.getElementById("summary-text").textContent = a.executive_summary || "Legal agreement summary.";
  document.getElementById("val-doc-type").textContent = a.document_type || "Agreement";

  // Parties
  const partiesEl = document.getElementById("val-parties");
  partiesEl.innerHTML = "";
  (a.parties_involved || []).forEach(p => {
    const li = document.createElement("li");
    li.textContent = p;
    partiesEl.appendChild(li);
  });

  document.getElementById("val-purpose").textContent = a.purpose || "N/A";

  // Obligations
  const obligEl = document.getElementById("val-obligations");
  obligEl.innerHTML = "";
  (a.obligations || []).forEach(o => {
    const li = document.createElement("li");
    li.textContent = o;
    obligEl.appendChild(li);
  });

  // Rights
  const rights = Array.isArray(a.rights) ? a.rights.join("; ") : a.rights;
  document.getElementById("val-rights").textContent = rights || "N/A";

  document.getElementById("val-payment").textContent = a.payment_terms || "N/A";
  document.getElementById("val-duration").textContent = a.duration_term || "N/A";
  document.getElementById("val-termination").textContent = a.termination_conditions || "N/A";
  document.getElementById("val-confidentiality").textContent = a.confidentiality || "N/A";

  const dates = Array.isArray(a.important_dates) ? a.important_dates.join(", ") : a.important_dates;
  document.getElementById("val-dates").textContent = dates || "N/A";

  document.getElementById("val-governing").textContent = a.governing_law || "N/A";
  document.getElementById("val-compliance").textContent = a.compliance_risk || "Standard commercial profile";

  document.getElementById("raw-json-content").textContent = JSON.stringify(a, null, 2);

  document.getElementById("results-dashboard").style.display = "block";
  document.getElementById("results-dashboard").scrollIntoView({ behavior: "smooth" });
}

function toggleRawJson() {
  const box = document.getElementById("raw-json-box");
  box.style.display = box.style.display === "none" ? "block" : "none";
}

function copyJson() {
  if (!currentAnalysisJson) return;
  navigator.clipboard.writeText(JSON.stringify(currentAnalysisJson, null, 2)).then(() => {
    alert("Structured Legal JSON copied to clipboard!");
  });
}

// Auto-load sample on first page load
window.addEventListener("DOMContentLoaded", async () => {
  await loadSample();
  const params = new URLSearchParams(window.location.search);
  if (params.get("demo") === "1" || params.get("autoload") === "1") {
    setTimeout(analyzeDocument, 300);
  }
});
