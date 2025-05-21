import { useEffect, useRef, useState } from "react";
import { Form } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import { AntInput, CustomButton } from "@components/form-inputs/index";
import { EAntStatusMessage, ELanguages } from "@enums/index";
import { addTranslations, fetchTranslations, translateIt, updateTranslations } from "@store/translationThunks";
import { useAntMessage } from "@hooks/useAntMessage";

const InputForm = () => {
  const selected = useSelector((state) => state.translations.selectedTranslation);
  
  const { showMessage } = useAntMessage();

  const [key, setKey] = useState(localStorage.getItem('Translation_Key') || '');
  const [isTranslated, setIsTranslated] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const [englishTranslate, setEnglishTranslate] = useState(localStorage.getItem('EN_Translation') || '');
  const [tamilTranslate, setTamilTranslate] = useState('');
  const [malayalamTranslate, setMalayalamTranslate] = useState('');
  const [teluguTranslate, setTeluguTranslate] = useState('');
  const [kannadaTranslate, setKannadaTranslate] = useState('');
  const [hindiTranslate, setHindiTranslate] = useState('');

  const [loading, setLoading] = useState(false);
  const formRef = useRef();
  const dispatch = useDispatch();

  const onTranslate = async (event) => {
    event.preventDefault();

    if (!englishTranslate.trim()) return;
    const textData = { text: englishTranslate.trim() }
    
    setIsTranslating(true);
    dispatch(translateIt(textData))
      .unwrap()
      .then((response) => {
        setIsTranslating(false);
        setIsTranslated(true);

        if (response.translations) {
          setTamilTranslate(response.translations.ta || '');
          setMalayalamTranslate(response.translations.ml || '');
          setTeluguTranslate(response.translations.te || '');
          setKannadaTranslate(response.translations.kn || '');
          setHindiTranslate(response.translations.hi || '');
        }
        showMessage(EAntStatusMessage.SUCCESS, 'Translation Success');    
      })
      .catch((error) => {
        setIsTranslating(false);
        showMessage(EAntStatusMessage.ERROR, `Translation API error: ${error}`);
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    setLoading(true);

    const action = selected
      ? updateTranslations({ id: selected.id, updatedData: data })
      : addTranslations(data);

    dispatch(action)
      .unwrap()
      .then((res) => {
        setLoading(false);
        resetForm();
        const message = res?.message || (selected ? 'Updated Successfully' : 'Saved Successfully');
        showMessage(EAntStatusMessage.SUCCESS, message);
        fetchTranslate();
      })
      .catch((error) => {
        setLoading(false);
        showMessage(EAntStatusMessage.ERROR, `${selected ? 'Update' : 'Save'} Failed: ${error}`);
      });
  };  

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

    dispatch({ type: 'translations/clearSelected' });
  }

  const fetchTranslate = () => {
    dispatch(fetchTranslations())
      .unwrap()
      .then()
      .catch((err) => {
        showMessage(EAntStatusMessage.ERROR, `Failed to fetch latest: ${err}`);
      });
  }

  useEffect(() => {
    if (selected) {
      setKey(selected.key || '');
      setEnglishTranslate(selected.en || '');
      setTamilTranslate(selected.ta || '');
      setHindiTranslate(selected.hi || '');
      setMalayalamTranslate(selected.ml || '');
      setTeluguTranslate(selected.te || '');
      setKannadaTranslate(selected.kn || '');
      setIsTranslated(true);
    }
  }, [selected])

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
              helpText="A unique key used in the code to switch between translations. 
              For example, using 'aadhaarCard' will show the text in the selected language automatically. Make sure, space are not allowed."
              helpTextPlacement="right"
              showCopy={true}
            />
          </div>

          <div className="col-span-3">
            <AntInput
              label={ELanguages.english}
              name="en"
              value={englishTranslate}
              valueChange={(value) => {
                setEnglishTranslate(value);
                localStorage.setItem('EN_Translation', value)
              }}
              placeholder="English Translation"
              showCopy={true}
            />
          </div>

          <div className="col-span-3">
            <AntInput
              label={ELanguages.tamil}
              name="ta"
              disabled={!isTranslated}
              value={tamilTranslate}
              valueChange={setTamilTranslate}
              placeholder="Tamil Translation"
              showCopy={true}
            />
          </div>

          <div className="col-span-3">
            <AntInput
              label={ELanguages.malayalam}
              name="ml"
              disabled={!isTranslated}
              value={malayalamTranslate}
              valueChange={setMalayalamTranslate}
              placeholder="Malayalam Translation"
              showCopy={true}
            />
          </div>

          <div className="col-span-3">
            <AntInput
              label={ELanguages.telugu}
              name="te"
              disabled={!isTranslated}
              value={teluguTranslate}
              valueChange={setTeluguTranslate}
              placeholder="Telugu Translation"
              showCopy={true}
            />
          </div>

          <div className="col-span-3">
            <AntInput
              label={ELanguages.kannada}
              name="kn"
              disabled={!isTranslated}
              value={kannadaTranslate}
              valueChange={setKannadaTranslate}
              placeholder="Kannada Translation"
              showCopy={true}
            />
          </div>

          <div className="col-span-3">
            <AntInput
              label={ELanguages.hindi}
              name="hi"
              disabled={!isTranslated}
              value={hindiTranslate}
              valueChange={setHindiTranslate}
              placeholder="Hindi Translation"
              showCopy={true}
            />
          </div>
        </div>

        <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-3">
          <CustomButton
            text="Translate"
            size="w-full sm:w-auto"
            onClick={onTranslate}
            isLoading={isTranslating}
            statusText="Translating"
            color='text-white'
            disabled={isTranslating || !englishTranslate}
          />
          {isTranslated &&
            <CustomButton
              type="submit"
              text={selected ? 'Update' : 'Add'}
              statusText={selected ? 'Updating' : 'Adding'}
              isLoading={loading}
              size="w-full sm:w-auto"
              bgcolor="btn-neutral"
              color='text-white'
              disabled={loading || key === ''}
          />
          }
          {selected && (
            <CustomButton
              text="Cancel Edit"
              color="hover:text-white"
              size="w-full sm:w-auto"
              bgcolor="btn-info btn-outline"
              onClick={resetForm}
            />
          )}
        </div>
      </Form>
    </div>
  );
};

export default InputForm;