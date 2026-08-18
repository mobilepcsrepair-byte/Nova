(() => {
  "use strict";

  const output = document.getElementById("output");
  const input = document.getElementById("command");
  const loadButton = document.getElementById("loadButton");
  const fileInput = document.getElementById("fileInput");

  if (!output || !input || !loadButton || !fileInput) {
    document.body.innerHTML = "<pre style='padding:20px'>NOVA failed to initialize: required HTML elements are missing.</pre>";
    return;
  }

  let records = [];
  let documents = [];
  let failures = [];

  const write = (text = "") => {
    output.textContent += text + "\n";
    output.scrollTop = output.scrollHeight;
  };

  const resetOutput = () => { output.textContent = ""; };

  const flatten = (value) => {
    if (value === null || value === undefined) return "";
    if (typeof value !== "object") return String(value);
    if (Array.isArray(value)) return value.map(flatten).join(" ");
    return Object.entries(value).map(([k, v]) => `${k} ${flatten(v)}`).join(" ");
  };

  const titleFor = (r) => r.name || r.title || r.model || r.term || r.architecture || r.manufacturer || r.brand || r.id || "Unnamed";

  async function indexFiles(fileList) {
    const files = Array.from(fileList).filter(f => f.name.toLowerCase().endsWith(".json"));

    records = [];
    documents = [];
    failures = [];

    if (!files.length) {
      write("No JSON files were selected.");
      return;
    }

    write(`Found ${files.length} JSON file(s).`);
    write("Indexing...");
    write("");

    for (const file of files) {
      try {
        const text = await file.text();
        const doc = JSON.parse(text);

        if (!doc || !Array.isArray(doc.data)) {
          throw new Error("File does not contain a data[] array");
        }

        const documentName = doc?.metadata?.document || file.name.replace(/\.json$/i, "");
        let count = 0;

        for (const item of doc.data) {
          if (!item || typeof item !== "object") continue;
          records.push({
            ...item,
            _document: documentName,
            _file: file.name,
            _search: flatten(item).toLowerCase()
          });
          count++;
        }

        documents.push({ name: documentName, file: file.name, records: count });
      } catch (error) {
        failures.push({ file: file.name, error: error?.message || String(error) });
      }
    }

    write(`NOVA indexed successfully.`);
    write(`Documents: ${documents.length}   Records: ${records.length}`);
    if (failures.length) write(`${failures.length} file(s) failed. Type failures for details.`);
    write("Type help for commands.");
    write("");
    input.focus();
  }

  function cleanRecord(record) {
    const clean = { ...record };
    delete clean._document;
    delete clean._file;
    delete clean._search;
    return clean;
  }

  function search(query) {
    if (!query) return write("Usage: search <query>");

    const q = query.toLowerCase();
    const results = records.filter(r => r._search.includes(q));

    if (!results.length) {
      return write(`No results for "${query}".`);
    }

    write(`Found ${results.length} result(s):`);
    write("");

    const shown = results.slice(0, 10);

    for (const r of shown) {
      write(`=== ${r.id || "no-id"} | ${titleFor(r)} | ${r._document} ===`);
      write(JSON.stringify(cleanRecord(r), null, 2));
      write("");
    }

    if (results.length > shown.length) {
      write(`Showing ${shown.length} results. Use info <id> for one exact record.`);
    }
  }

  function info(id) {
    if (!id) return write("Usage: info <id>");
    const r = records.find(x => String(x.id) === id);
    if (!r) return write(`No record found with ID: ${id}`);
    const clean = { ...r };
    delete clean._document; delete clean._file; delete clean._search;
    write(JSON.stringify(clean, null, 2));
  }

  function list(documentName) {
    if (!documentName) return write("Usage: list <document>");
    const q = documentName.toLowerCase();
    const results = records.filter(r => r._document.toLowerCase() === q);
    if (!results.length) return write(`No document found: ${documentName}`);
    write(`${documentName}: ${results.length} record(s)`);
    for (const r of results) write(`${r.id || "no-id"} | ${titleFor(r)}`);
  }

  function docs() {
    if (!documents.length) return write("No documents indexed.");
    for (const d of documents) write(`${d.name} | ${d.records} records | ${d.file}`);
  }

  function stats() {
    write(`Documents: ${documents.length}`);
    write(`Records: ${records.length}`);
    write(`Failed files: ${failures.length}`);
  }

  function showFailures() {
    if (!failures.length) return write("No failed files.");
    for (const f of failures) write(`${f.file} | ${f.error}`);
  }

  function help() {
    write("Commands");
    write("load — choose your JSON files");
    write("search <query> — search every indexed record");
    write("info <id> — show a record by exact ID");
    write("list <document> — show records from one document");
    write("docs — show indexed documents and record counts");
    write("stats — show index statistics");
    write("failures — show files that failed to load");
    write("clear — clear the terminal");
    write("help — show this help");
  }

  function execute(line) {
    const text = line.trim();
    if (!text) return;

    write(`> ${text}`);
    const parts = text.split(/\s+/);
    const cmd = parts.shift().toLowerCase();
    const arg = parts.join(" ");

    switch (cmd) {
      case "load": fileInput.click(); break;
      case "search": search(arg); break;
      case "info": info(arg); break;
      case "list": list(arg); break;
      case "docs": docs(); break;
      case "stats": stats(); break;
      case "failures": showFailures(); break;
      case "clear": resetOutput(); break;
      case "help": help(); break;
      default:
        write(`Unknown command: ${cmd}`);
        write("Type help.");
    }

    write("");
  }

  loadButton.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", async () => {
    const files = fileInput.files;
    if (!files || !files.length) return;

    resetOutput();
    write("NOVA");
    write("Hardware Knowledge Base");
    write("");
    await indexFiles(files);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const value = input.value;
    input.value = "";
    execute(value);
  });

  document.addEventListener("click", () => input.focus());

  write("NOVA");
  write("Hardware Knowledge Base");
  write("");
  write("No knowledge loaded.");
  write("Click 'Load Knowledge JSON', select all the JSON files inside your Knowledge folder, then press Open.");
  write("Type help for commands.");
  write("");
})();
