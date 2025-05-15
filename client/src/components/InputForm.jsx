import { Form } from "react-router-dom";
import { AntInput, CustomButton } from "./form-inputs";
import { useRef, useState } from "react";
import axios from "axios";
import { Spin } from "antd"; // Import Ant Design's Spin component
import { EAntStatusMessage } from "../enums";
import { showMessage } from "../hooks/useAntMessage";

const InputForm = () => {
  const [key, setKey] = useState(localStorage.getItem('Translation_Key') || '');
  const [isTranslated, setIsTranslated] = useState(false);

  const [englishTranslate, setEnglishTranslate] = useState(localStorage.getItem('EN_Translation') || '');
  const [tamilTranslate, setTamilTranslate] = useState('');
  const [malayalamTranslate, setMalayalamTranslate] = useState('');
  const [teluguTranslate, setTeluguTranslate] = useState('');
  const [kannadaTranslate, setKannadaTranslate] = useState('');
  const [hindiTranslate, setHindiTranslate] = useState('');

  const [loading, setLoading] = useState(false);
  const formRef = useRef();

  const onTranslate = async (event) => {
    event.preventDefault();

    if (!englishTranslate.trim()) return; // Don't submit if English is empty

    setLoading(true); // Set loading to true when the request starts
    try {
      const response = await axios.post("http://localhost:5001/translate", {
        text: englishTranslate.trim(),
      });
      
      setIsTranslated(true);

      const data = response.data;
      if (data.translations) {
        setTamilTranslate(data.translations.ta || '');
        setMalayalamTranslate(data.translations.ml || '');
        setTeluguTranslate(data.translations.te || '');
        setKannadaTranslate(data.translations.kn || '');
        setHindiTranslate(data.translations.hi || '');
      }

      showMessage(EAntStatusMessage.SUCCESS, 'Translation Success');
    } catch (error) {
      showMessage(EAntStatusMessage.ERROR, `Translation API error: ${error}`);
    } finally {
      setLoading(false); // Set loading to false after the request finishes
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    resetForm();
    showMessage('success', 'Test');
  }

  // Clear input fields
  const resetForm = () => {
    setKey('');
    setEnglishTranslate('');
    setTamilTranslate('');
    setMalayalamTranslate('');
    setTeluguTranslate('');
    setKannadaTranslate('');
    setHindiTranslate('');
    
    setIsTranslated(false);

    localStorage.removeItem('Translation_Key');
    localStorage.removeItem('EN_Translation');
  }

  return (
    <div className="w-full space-y-5 relative">
      {loading && (
        <div className="absolute inset-0 z-10 flex justify-center items-center">
          <Spin size="large" />
        </div>
      )}
      <div className="w-max mx-auto sm:mx-0 pb-0.5 border-b-3 border-primary">
        <h3 className="text-lg font-medium">Add the Translation</h3>
      </div>
      <Form method="POST" ref={formRef} onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 xl:grid-cols-12 gap-5">
          <div className="col-span-3">
            <AntInput
              label="Key"
              name="key"
              value={key}
              valueChange={(value) => {
                setKey(value);
                localStorage.setItem('Translation_Key', value)
              }}
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
              valueChange={(value) => {
                setEnglishTranslate(value);
                localStorage.setItem('EN_Translation', value)
              }}
              placeholder="English Translation"
            />
          </div>

          <div className="col-span-3">
            <AntInput
              label="Tamil (தமிழ்)"
              name="ta"
              disabled={!isTranslated}
              value={tamilTranslate}
              valueChange={setTamilTranslate}
              placeholder="Tamil Translation"
            />
          </div>

          <div className="col-span-3">
            <AntInput
              label="Malayalam (മലയാളം)"
              name="ml"
              disabled={!isTranslated}
              value={malayalamTranslate}
              valueChange={setMalayalamTranslate}
              placeholder="Malayalam Translation"
            />
          </div>

          <div className="col-span-3">
            <AntInput
              label="Telugu (తెలుగు)"
              name="te"
              disabled={!isTranslated}
              value={teluguTranslate}
              valueChange={setTeluguTranslate}
              placeholder="Telugu Translation"
            />
          </div>

          <div className="col-span-3">
            <AntInput
              label="Kannada (ಕನ್ನಡ)"
              name="kn"
              disabled={!isTranslated}
              value={kannadaTranslate}
              valueChange={setKannadaTranslate}
              placeholder="Kannada Translation"
            />
          </div>

          <div className="col-span-3">
            <AntInput
              label="Hindi (हिंदी)"
              name="hi"
              disabled={!isTranslated}
              value={hindiTranslate}
              valueChange={setHindiTranslate}
              placeholder="Hindi Translation"
            />
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row justify-center items-center gap-3">
          <CustomButton
            text="translate"
            size="btn-md"
            type="button"
            onClick={onTranslate}
            disabled={loading || !englishTranslate}
          />
          {isTranslated &&
            <CustomButton
              size="md:btn-md"
              bgcolor="btn-neutral"
              disabled={loading || key === ''}
          />
          }
        </div>
      </Form>
    </div>
  );
};

export default InputForm;