import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { REST_ENDPOINT } from '../constants';
import createHeaders from '../utils/createHeaders';

function parseJsonArray(str: string | undefined) {
  if (!str)
    return [];
  try {
    const jsonArray = JSON.parse(str);

    // Verify if the parsed array is not blank
    if (Array.isArray(jsonArray) && jsonArray.length > 0) {
      return jsonArray;
    } else {
      // Return an empty array if the parsed array is blank
      return [];
    }
  } catch (error) {
    // Handle parsing errors (e.g., invalid JSON)
    console.error('Error parsing JSON:', (error as any)?.message);
    return [];
  }
}

const useEditForm = (entry: EntryType | null, onSuccess: (msg: string, entry: EntryType) => void) => {
  const [content, setContent] = useState<string>(entry?.content || '');
  const textareaInput = useRef<HTMLTextAreaElement>(null);
  const dateInput = useRef<HTMLInputElement>(null);
  const locationsInput = useRef<HTMLTextAreaElement>();

  const locationPrepTitle = useRef<HTMLInputElement>();
  const locationPrep = useRef<HTMLInputElement>();
  const [locations, setLocations] = useState<any[]>([]);

  const populateLocations = () => {
    const parsedLocations = parseJsonArray(locationsInput?.current?.value);
    setLocations(parsedLocations);
  };
  const populateLocationsInput = () => {
    if (locationsInput && locationsInput.current) {
      locationsInput.current.value = JSON.stringify(locations);
    }
  };

  function parseLocationPrep() {
    // The different forms of expected input
    // 1. 37.82879684957708, -122.42176267186676
    // 2. https://maps.apple.com/?address=1500%20S%20Tenth%20St,%20San%20Jose,%20CA%2095112,%20United%20States&auid=4146272712971004545&ll=37.319246,-121.864025&lsp=9902&q=Sharks%20Ice&t=m

    console.log((locationPrep as any)?.current.value);

    let pieces: string[] = [];
    if((locationPrep?.current?.value as string)?.includes('maps.apple.com')){
      const regex = /&ll=([^&]+)/;
      const match = (locationPrep?.current?.value as string)?.match(regex);
      if(match && match[1]){
        pieces = (match[1] as string).split(',');
      }
    }else{
      pieces = (locationPrep?.current?.value as string).split(',');
    }

    const newLocation = {
      title: locationPrepTitle?.current?.value,
      lat: parseFloat(pieces[0]),
      lng: parseFloat(pieces[1])
    }
    setLocations([...locations, newLocation]);
  }

  function textChange() {
    const pattern = /@@([\w-]*)@@/g;
    const replacement = '<i class="fa fa-$1" ></i> ';
    const refTextarea = textareaInput.current || { value: '' };
    refTextarea.value = refTextarea.value.replace(pattern, replacement);
    setContent(refTextarea.value);
  }

  function locationChange() {

  }

  async function handleSave() {
    console.log('handleSave entry :');
    const requestHeaders = createHeaders();
    const newEntry = {
      ...entry,
      content: textareaInput.current?.value || '',
      date: dateInput.current?.value || '',
      locations: locationsInput.current?.value || ""
    };
    const options = {
      method: 'PUT',
      body: JSON.stringify(newEntry),
      headers: requestHeaders,
      mode: 'cors'
    } as any;

    try {
      const response = await fetch(`${REST_ENDPOINT}/api/posts/${entry?.id}`, options);

      console.log(response);
    } catch (error) {
      console.log(error);
      toast((error as any).message);
      onSuccess('Edit fail' + error, newEntry as EntryType);
    }

    onSuccess('Edit Done', newEntry as EntryType);
  }

  /**
   * The above function handles the deletion of a post by sending a DELETE request to
   * the server and displaying a success message or an error message.
   * @returns The function `handleDelete` returns nothing (`undefined`).
   */
  async function handleDelete() {
    const go = window.confirm('You sure?');
    if (!go) {
      return;
    }
    const id = entry?.id || 0;
    console.log(`handleDelete ${id}`);

    const requestHeaders = createHeaders();

    try {
      const response = await fetch(
        `${REST_ENDPOINT}/api/posts/${id}`,
        {
          method: 'DELETE',
          mode: 'cors',
          headers: requestHeaders
        },
      );

      console.log(response);
    } catch (error) {
      console.log(error);
      toast((error as any).message);
    }
    onSuccess('Delete Done', { id, content: 'DELETE', date: '' });
  }

  function checkKeyPressed(e: any) {
    if (e.altKey && e.key === 's') {
      console.log('S keybinding');
      // could convert this to refs instead?
      document.getElementById('saveBtn')?.click();
    } else if (e.key === 'Escape') {
      document.getElementById('cancelBtn')?.click();
    }
  }

  useEffect(() => {
    // console.log('EditForm: useEffect');
    textareaInput.current?.focus();
    const textLength = textareaInput.current?.value.length || 0;
    textareaInput.current?.setSelectionRange(textLength, textLength);
    document.addEventListener('keydown', checkKeyPressed);
    return () => document.removeEventListener('keydown', checkKeyPressed);
  }, []);
  return {
    textareaInput, content, dateInput, locationsInput, locationChange, handleDelete, textChange, handleSave,
    locationPrepTitle,
    locationPrep, locations, populateLocations, populateLocationsInput, parseLocationPrep,
  };
};

export default useEditForm;

