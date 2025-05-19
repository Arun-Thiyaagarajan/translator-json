import { Input, Tooltip } from "antd";
import { CircleHelp } from "lucide-react";
import { MdOutlineContentCopy } from "react-icons/md";
import { useAntMessage } from "../../hooks/useAntMessage";
import { EAntStatusMessage } from "../../enums";

const AntInput = ({
  label, name, valueChange, value='', placeholder, prefix, suffix, addonBefore,
  shouldRestrictSpace=false, showHelpIcon=false, helpText, helpTextPlacement,
  disabled=false, showCopy=false
}) => {
  const { showMessage } = useAntMessage();
  
  const handleChange = (e) => {
    valueChange(e.target.value);
  };

  const restrictSpace = (e) => {
    if (shouldRestrictSpace && e.key === ' ') {
      e.preventDefault();
    }
  }

  // Clipboard copy logic
  const handleCopy = async () => {
    if (value) {
      try {
        await navigator.clipboard.writeText(value.trim());
        showMessage(EAntStatusMessage.SUCCESS, 'Copied Successfully')
      } catch (err) {
        showMessage(EAntStatusMessage.ERROR, 'Copy failed')
      }
    }
  };
  
  const computedSuffix = showCopy && !disabled ? (
    <span className="copy-icon-wrapper">
      <Tooltip title='Copy to Clipboard'>
        <span
          onClick={handleCopy}
          style={{ visibility: value ? 'visible' : 'hidden', cursor: value ? 'pointer' : 'default' }}
        >
          <MdOutlineContentCopy className="text-primary" />
        </span>
      </Tooltip>
    </span>
  ) : suffix;
  

  return (
    <div className="form-group w-full">
      <div className="label flex items-center mb-1">
        <span className="text-primary-content font-semibold capitalize text-sm">{label}</span>
        {showHelpIcon &&
          <Tooltip title={helpText ?? ''} placement={helpTextPlacement ?? "top"}>
            <CircleHelp className="mr-2 text-primary" size={18} />
          </Tooltip> 
        }
      </div>

      <div className={`h-11 ${disabled ? 'bg-base-200' : 'bg-white'} border border-slate-300 rounded-lg flex items-center focus-within:ring-1 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-white transition-shadow`}>
        <Input
          variant="borderless"
          addonBefore={addonBefore || ''}
          placeholder={placeholder || ''}
          prefix={prefix || ''}
          suffix={computedSuffix}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          onKeyDown={restrictSpace}
          onPaste={(e) => {
            const pastedData = e.clipboardData.getData('Text');
            if (/\s/.test(pastedData) && shouldRestrictSpace) {
              e.preventDefault();
            }
          }}
          className="w-full label-text" />
        {/* Hidden input to capture the select value for form submission */}
        <input
          id={name}
          type="hidden"
          name={name}
          value={value}
        />
        <label htmlFor={name} className="sr-only">{placeholder}</label>
      </div>
    </div>
  );
}
export default AntInput;