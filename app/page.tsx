"use client";

import React, { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaRegEnvelope,
  FaGlobe,
  FaRegPaperPlane,
  FaFilePdf,
} from "react-icons/fa";

type DeliveryOption = {
  title: string;
  description: string;
  icon: React.ReactNode;
  price?: number;
};

type PhonePrefix = {
  code: string;
  country: string;
};

type PersonData = {
  nome: string;
  nazione: string;
  indirizzo: string;
  citta: string;
  cap: string;
  telefono: string;
  email: string;
};

type Preview =
  | { type: "image"; src: string }
  | { type: "pdf"; src: string };

// Opzioni generiche, senza "canale urgente"
const deliveryOptions: DeliveryOption[] = [
  {
    title: "STANDARD",
    description: "Consegna stimata in 3–6 giorni lavorativi",
    icon: <FaEnvelope className="text-[#1d4ed8] text-3xl" />,
  },
  {
    title: "TRACCIATA",
    description: "Consegna stimata in 3–6 giorni con tracking",
    icon: <FaRegEnvelope className="text-[#1d4ed8] text-3xl" />,
  },
  {
    title: "INTERNAZIONALE",
    description: "Consegna stimata in 7–20 giorni lavorativi",
    icon: <FaGlobe className="text-[#1d4ed8] text-3xl" />,
  },
  {
    title: "INTERNAZIONALE CON RICEVUTA",
    description: "Consegna stimata in 7–20 giorni con conferma",
    icon: <FaRegPaperPlane className="text-[#1d4ed8] text-3xl" />,
  },
];

const phonePrefixes: PhonePrefix[] = [
  { code: "+39", country: "Italia" },
  { code: "+1", country: "USA/Canada" },
  { code: "+44", country: "Regno Unito" },
  { code: "+34", country: "Spagna" },
  { code: "+49", country: "Germania" },
  { code: "+33", country: "Francia" },
  { code: "+378", country: "San Marino" },
  { code: "+41", country: "Svizzera" },
];

const countries: string[] = [
  "Italia",
  "Germania",
  "Francia",
  "Spagna",
  "Regno Unito",
  "USA",
  "Canada",
  "Svizzera",
  "San Marino",
  "Altro...",
];

type PersonField = keyof PersonData;

export default function DocumentFlowShell() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [senderPrefix, setSenderPrefix] = useState<string>("+39");
  const [receiverPrefix, setReceiverPrefix] = useState<string>("+39");
  const [step, setStep] = useState<number>(1);

  // Mittente
  const [mittente, setMittente] = useState<PersonData>({
    nome: "",
    nazione: countries[0],
    indirizzo: "",
    citta: "",
    cap: "",
    telefono: "",
    email: "",
  });

  // Destinatario
  const [destinatario, setDestinatario] = useState<PersonData>({
    nome: "",
    nazione: countries[0],
    indirizzo: "",
    citta: "",
    cap: "",
    telefono: "",
    email: "",
  });



 type PersonField = keyof PersonData;

const updateMittenteField = (field: PersonField, value: string) => {
  setMittente((prev) => ({ ...prev, [field]: value }));
};

const updateDestinatarioField = (field: PersonField, value: string) => {
  setDestinatario((prev) => ({ ...prev, [field]: value }));
};

  useEffect(() => {
    return () => {
      if (preview && preview.src) {
        URL.revokeObjectURL(preview.src);
      }
    };
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selectedFile);

    if (preview && preview.src) {
      URL.revokeObjectURL(preview.src);
    }

    if (selectedFile.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setPreview({ type: "image", src: imageUrl });
    } else if (selectedFile.type === "application/pdf") {
      const pdfUrl = URL.createObjectURL(selectedFile);
      setPreview({ type: "pdf", src: pdfUrl });
    } else {
      setPreview(null);
    }
  };

  // Stub pagamento (resta come demo)
  const handlePayment = () => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve("Pagamento effettuato con successo!");
      }, 1500);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedOption === null) {
      alert("Seleziona un tipo di spedizione.");
      return;
    }
    if (!file) {
      alert("Carica un file PDF o immagine.");
      return;
    }

    try {
      await handlePayment();
      setStep(2);
    } catch (error) {
      alert("Errore nel pagamento. Riprova.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#0f172a] font-sans p-4 sm:p-8 md:p-12 flex flex-col items-center">
      <div className="max-w-7xl w-full space-y-8">
        {/* HEADER IN STILE SHELL */}
        <header className="space-y-3 mb-2 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] tracking-[0.26em] uppercase text-slate-500">
              guglielmogiannattasio.exe · document flow shell v01
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold mb-1 select-none">
            Document flow shell
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Interfaccia neutra per flussi di invio documenti: selezione servizio,
            dati mittente/destinatario, upload file e riepilogo. Multi-brand
            ready, agganciabile a logiche di business diverse.
          </p>
        </header>

        {/* OPZIONI DI CONSEGNA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {deliveryOptions.map((opt, idx) => {
            const isSelected = selectedOption === idx;

            return (
              <button
                key={opt.title}
                onClick={() => setSelectedOption(idx)}
                type="button"
                className={`flex flex-col items-center justify-center p-5 rounded-2xl cursor-pointer transition-all duration-200 select-none border ${
                  isSelected
                    ? "bg-[#e0edff] border-[#1d4ed8] shadow-sm"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
                style={{ userSelect: "none" }}
              >
                <div className="mb-3">{opt.icon}</div>
                <h2 className="font-semibold text-sm text-center leading-tight uppercase tracking-wide">
                  {opt.title}
                </h2>
                <p className="text-xs text-slate-600 mt-2 text-center">
                  {opt.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* INDICATORE STEP */}
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3 text-xs text-slate-600 mb-4">
          <div className="flex items-center gap-1">
            <span
              className={`inline-flex h-2 w-2 rounded-full ${
                step === 1 ? "bg-[#1d4ed8]" : "bg-slate-300"
              }`}
            />
            <span>Dati e documento</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <span
              className={`inline-flex h-2 w-2 rounded-full ${
                step === 2 ? "bg-[#1d4ed8]" : "bg-slate-300"
              }`}
            />
            <span>Riepilogo</span>
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-6 sm:p-10 shadow-md max-w-4xl mx-auto space-y-10 border border-slate-200"
          >
            {/* Mittente */}
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-6 select-none">
                Dati del mittente
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Nome e Cognome / Ragione sociale"
                  className="input-style"
                  required
                  value={mittente.nome}
                  onChange={(e) =>
                    updateMittenteField("nome", e.target.value)
                  }
                />
                <select
                  className="input-style"
                  value={mittente.nazione}
                  onChange={(e) =>
                    updateMittenteField("nazione", e.target.value)
                  }
                  aria-label="Nazione mittente"
                >
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Indirizzo"
                  className="input-style"
                  required
                  value={mittente.indirizzo}
                  onChange={(e) =>
                    updateMittenteField("indirizzo", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Città"
                  className="input-style"
                  required
                  value={mittente.citta}
                  onChange={(e) =>
                    updateMittenteField("citta", e.target.value)
                  }
                />

                <input
                  type="text"
                  placeholder="CAP"
                  className="input-style"
                  required
                  value={mittente.cap}
                  onChange={(e) =>
                    updateMittenteField("cap", e.target.value)
                  }
                />

                <div className="flex space-x-3 col-span-1 sm:col-span-2">
                  <select
                    className="input-style w-32 flex-shrink-0"
                    value={senderPrefix}
                    onChange={(e) => setSenderPrefix(e.target.value)}
                    aria-label="Prefisso telefonico mittente"
                  >
                    {phonePrefixes.map(({ code, country }) => (
                      <option key={code + "-" + country} value={code}>
                        {code} ({country})
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    placeholder="Telefono"
                    className="input-style flex-grow"
                    value={mittente.telefono}
                    onChange={(e) =>
                      updateMittenteField("telefono", e.target.value)
                    }
                  />
                </div>

                <input
                  type="email"
                  placeholder="Email"
                  className="input-style col-span-1 sm:col-span-2"
                  value={mittente.email}
                  onChange={(e) =>
                    updateMittenteField("email", e.target.value)
                  }
                />
              </div>
            </section>

            {/* Destinatario */}
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-6 select-none">
                Dati del destinatario
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Nome e Cognome / Ragione sociale"
                  className="input-style"
                  required
                  value={destinatario.nome}
                  onChange={(e) =>
                    updateDestinatarioField("nome", e.target.value)
                  }
                />
                <select
                  className="input-style"
                  value={destinatario.nazione}
                  onChange={(e) =>
                    updateDestinatarioField("nazione", e.target.value)
                  }
                  aria-label="Nazione destinatario"
                >
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Indirizzo"
                  className="input-style"
                  required
                  value={destinatario.indirizzo}
                  onChange={(e) =>
                    updateDestinatarioField("indirizzo", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Città"
                  className="input-style"
                  required
                  value={destinatario.citta}
                  onChange={(e) =>
                    updateDestinatarioField("citta", e.target.value)
                  }
                />

                <input
                  type="text"
                  placeholder="CAP"
                  className="input-style"
                  required
                  value={destinatario.cap}
                  onChange={(e) =>
                    updateDestinatarioField("cap", e.target.value)
                  }
                />

                <div className="flex space-x-3 col-span-1 sm:col-span-2">
                  <select
                    className="input-style w-32 flex-shrink-0"
                    value={receiverPrefix}
                    onChange={(e) => setReceiverPrefix(e.target.value)}
                    aria-label="Prefisso telefonico destinatario"
                  >
                    {phonePrefixes.map(({ code, country }) => (
                      <option key={code + "-" + country} value={code}>
                        {code} ({country})
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    placeholder="Telefono"
                    className="input-style flex-grow"
                    value={destinatario.telefono}
                    onChange={(e) =>
                      updateDestinatarioField("telefono", e.target.value)
                    }
                  />
                </div>

                <input
                  type="email"
                  placeholder="Email"
                  className="input-style col-span-1 sm:col-span-2"
                  value={destinatario.email}
                  onChange={(e) =>
                    updateDestinatarioField("email", e.target.value)
                  }
                />
              </div>
            </section>

            {/* Contenuto / Documento */}
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold mb-6 select-none">
                Documento da inviare
              </h2>
              <label
                htmlFor="file-upload"
                className="cursor-pointer mx-auto flex flex-col items-center justify-center rounded-3xl p-10 max-w-md text-center text-[#1d4ed8] transition-colors duration-200
                bg-slate-50 border-2 border-dashed border-[#1d4ed8] hover:bg-slate-100"
                style={{ userSelect: "none" }}
              >
                <FaFilePdf size={44} className="mb-4 opacity-90" />
                <span className="text-base font-medium select-none">
                  Scegli file (PDF o immagine)
                </span>
                <span className="mt-1 text-xs text-slate-500">
                  Dimensioni massime e formati gestiti lato progetto.
                </span>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleFileChange}
                  required={!file}
                />
              </label>

              {preview && (
                <div
                  className="mt-8 max-w-full mx-auto rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-center"
                  style={{ minHeight: "260px" }}
                >
                  {preview.type === "image" ? (
                    <img
                      src={preview.src}
                      alt="Anteprima file caricato"
                      className="max-w-full max-h-[460px] rounded-lg object-contain"
                    />
                  ) : (
                    <iframe
                      src={preview.src}
                      title="Anteprima PDF"
                      className="w-full h-[380px] sm:h-[460px] rounded-lg"
                    />
                  )}
                </div>
              )}
            </section>

            <button
              type="submit"
              className="w-full mt-10 bg-[#1d4ed8] text-white font-semibold py-4 rounded-2xl hover:bg-[#1e40af] transition-colors"
            >
              Procedi al riepilogo
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-3xl mx-auto shadow-md border border-slate-200 space-y-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-2 select-none">
              Riepilogo ordine
            </h2>

            <div className="space-y-6 text-sm sm:text-base text-slate-800">
              <div>
                <h3 className="text-lg font-semibold mb-2 select-none">
                  Tipo di servizio
                </h3>
                {selectedOption !== null && (
                  <>
                    <p className="font-medium">
                      {deliveryOptions[selectedOption].title}
                    </p>
                    <p className="text-xs text-slate-600">
                      {deliveryOptions[selectedOption].description}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      Prezzo indicativo: €
                      {deliveryOptions[selectedOption]?.price !== undefined
                        ? deliveryOptions[selectedOption].price!.toFixed(2)
                        : "0.00"}
                    </p>
                  </>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 select-none">
                  Mittente
                </h3>
                <p>
                  <strong>Nome:</strong> {mittente.nome}
                </p>
                <p>
                  <strong>Nazione:</strong> {mittente.nazione}
                </p>
                <p>
                  <strong>Indirizzo:</strong> {mittente.indirizzo}
                </p>
                <p>
                  <strong>Città:</strong> {mittente.citta}
                </p>
                <p>
                  <strong>CAP:</strong> {mittente.cap}
                </p>
                <p>
                  <strong>Telefono:</strong> {senderPrefix}{" "}
                  {mittente.telefono}
                </p>
                <p>
                  <strong>Email:</strong> {mittente.email}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 select-none">
                  Destinatario
                </h3>
                <p>
                  <strong>Nome:</strong> {destinatario.nome}
                </p>
                <p>
                  <strong>Nazione:</strong> {destinatario.nazione}
                </p>
                <p>
                  <strong>Indirizzo:</strong> {destinatario.indirizzo}
                </p>
                <p>
                  <strong>Città:</strong> {destinatario.citta}
                </p>
                <p>
                  <strong>CAP:</strong> {destinatario.cap}
                </p>
                <p>
                  <strong>Telefono:</strong> {receiverPrefix}{" "}
                  {destinatario.telefono}
                </p>
                <p>
                  <strong>Email:</strong> {destinatario.email}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 select-none">
                  File caricato
                </h3>
                {file ? <p>{file.name}</p> : <p>Nessun file.</p>}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-2xl border border-[#1d4ed8] text-[#1d4ed8] font-semibold hover:bg-[#1d4ed8] hover:text-white transition-colors duration-200 select-none"
              >
                Torna indietro
              </button>

              <button
                onClick={async () => {
                  try {
                    await handlePayment();
                    alert("Pagamento effettuato con successo!");
                  } catch (error) {
                    alert("Errore nel pagamento. Riprova.");
                  }
                }}
                className="flex-1 py-3 rounded-2xl bg-[#1d4ed8] text-white font-semibold hover:bg-[#1e40af] transition-colors duration-200 select-none"
              >
                Conferma e invia
              </button>
            </div>
          </div>
        )}

        {/* SYSTEM NOTES */}
        <section className="pt-4 pb-10">
          <div className="max-w-5xl mx-auto rounded-2xl border border-slate-200 bg-white px-5 sm:px-7 py-7 sm:py-8 grid md:grid-cols-3 gap-x-8 gap-y-6 text-sm">
            <div className="space-y-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">
                  Layer
                </p>
                <p className="text-slate-800">
                  Shell UI neutra, front-end only.
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">
                  Use cases
                </p>
                <p className="text-slate-800">
                  Invio documenti, richieste formali, flussi di uploading.
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">
                  Status
                </p>
                <p className="text-slate-800">
                  Multi-brand ready, business-logic agnostic.
                </p>
              </div>
            </div>

            <div className="md:col-span-2 space-y-3 text-slate-700 leading-relaxed">
              <p>
                Questo non è un prodotto finito ma una shell: una struttura
                riutilizzabile per flussi di invio documenti che puoi collegare
                a brand, testi, sistemi di pagamento e API diversi.
              </p>
              <p>
                La UI resta coerente (step, riepilogo, upload, validazioni),
                mentre tutto ciò che riguarda logiche di prezzo, integrazioni
                esterne e gestione dei file può cambiare per progetto.
              </p>
              <p>
                Puoi agganciarla a gateway di pagamento, sistemi interni,
                endpoint custom. La parte che l’utente vede è questa; il resto
                vive lato back-end o servizi esterni.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
