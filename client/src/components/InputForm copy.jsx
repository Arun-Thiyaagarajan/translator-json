import { Form } from "react-router-dom";
import { AntInput, SubmitBtn } from "./form-inputs";
import { useState } from "react";
import axios from "axios";
import { Spin } from "antd"; // Import Ant Design's Spin component

const InputForm = () => {
  const [key, setKey] = useState('');
  const [englishTranslate, setEnglishTranslate] = useState('');
  const [tamilTranslate, setTamilTranslate] = useState('');
  const [malayalamTranslate, setMalayalamTranslate] = useState('');
  const [teluguTranslate, setTeluguTranslate] = useState('');
  const [kannadaTranslate, setKannadaTranslate] = useState('');
  const [hindiTranslate, setHindiTranslate] = useState('');

  const [loading, setLoading] = useState(false); // State for loader

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!englishTranslate.trim()) return; // Don't submit if English is empty

    setLoading(true); // Set loading to true when the request starts
    try {
      const response = await axios.post("http://localhost:5001/translate", {
        text: englishTranslate.trim(),
      });

      const data = response.data;
      if (data.translations) {
        setTamilTranslate(data.translations.ta || '');
        setMalayalamTranslate(data.translations.ml || '');
        setTeluguTranslate(data.translations.te || '');
        setKannadaTranslate(data.translations.kn || '');
        setHindiTranslate(data.translations.hi || '');
      }
    } catch (error) {
      console.error("Translation API error:", error);
    } finally {
      setLoading(false); // Set loading to false after the request finishes
    }
  };

  return (
    <div className="w-full space-y-5">
      <div className="w-max pb-0.5 border-b-3 border-primary">
        <h3 className="text-lg font-medium">Add the Translation</h3>
      </div>
      <Form method="POST" onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 xl:grid-cols-12 gap-5">
          <div className="col-span-3">
            <AntInput
              label="Key"
              name="key"
              value={key}
              valueChange={setKey}
              placeholder="Enter the Key"
              shouldRestrictSpace={true}
              showHelpIcon={true}
              helpText="Space is not allowed"
              helpTextPlacement="right"
            />
          </div>

          <div className="col-span-3">
            <AntInput
              label="English"
              name="en"
              value={englishTranslate}
              valueChange={setEnglishTranslate}
              placeholder="English Translation"
            />
          </div>

          <div className="col-span-3">
            <AntInput
              label="Tamil"
              name="ta"
              disabled={!englishTranslate && !tamilTranslate}
              value={tamilTranslate}
              valueChange={setTamilTranslate}
              placeholder="Tamil Translation"
            />
          </div>

          <div className="col-span-3">
            <AntInput
              label="Malayalam"
              name="ml"
              disabled={!englishTranslate && !malayalamTranslate}
              value={malayalamTranslate}
              valueChange={setMalayalamTranslate}
              placeholder="Malayalam Translation"
            />
          </div>

          <div className="col-span-3">
            <AntInput
              label="Telugu"
              name="te"
              disabled={!englishTranslate && !teluguTranslate}
              value={teluguTranslate}
              valueChange={setTeluguTranslate}
              placeholder="Telugu Translation"
            />
          </div>

          <div className="col-span-3">
            <AntInput
              label="Kannada"
              name="kn"
              disabled={!englishTranslate && !kannadaTranslate}
              value={kannadaTranslate}
              valueChange={setKannadaTranslate}
              placeholder="Kannada Translation"
            />
          </div>

          <div className="col-span-3">
            <AntInput
              label="Hindi"
              name="hi"
              disabled={!englishTranslate && !hindiTranslate}
              value={hindiTranslate}
              valueChange={setHindiTranslate}
              placeholder="Hindi Translation"
            />
          </div>
        </div>

        <div className="w-full flex justify-center items-center">
          {loading ? (
            <Spin size="large" /> // Show loader during translation fetching
          ) : (
            <SubmitBtn text="translate" size="btn-wide" />
          )}
        </div>
      </Form>
    </div>
  );
};

export default InputForm;