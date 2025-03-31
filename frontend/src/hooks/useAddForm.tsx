import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { REST_ENDPOINT } from '../constants';
import { EntryType } from '../Types';
import createHeaders from '../utils/createHeaders';

interface AddHookParams {
  onSuccess: (msg: string, entry: EntryType) => void;
};

interface FormElements {
  content: HTMLTextAreaElement;
  dateInput: HTMLInputElement;
  locationContent: HTMLTextAreaElement;
  newLocationTitle: HTMLInputElement;
  newLocationCoords: HTMLInputElement;
}

const useAddForm = ({ onSuccess }: AddHookParams) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const isMounted = useRef(false);

  const getFormElements = (): FormElements | null => {
    if (!formRef.current) return null;

    return {
      content: formRef.current.querySelector('textarea[name="content"]') as HTMLTextAreaElement,
      dateInput: formRef.current.querySelector('input[name="dateInput"]') as HTMLInputElement,
      locationContent: formRef.current.querySelector('textarea[name="locationContent"]') as HTMLTextAreaElement,
      newLocationTitle: formRef.current.querySelector('input[name="newLocationTitle"]') as HTMLInputElement,
      newLocationCoords: formRef.current.querySelector('input[name="newLocationCoords"]') as HTMLInputElement,
    };
  };

  const textChange = () => {
    const elements = getFormElements();
    if (!elements) return;

    const pattern = /@@([\w-]*)@@/g;
    const replacement = '<i class="fa fa-$1" /> ';
    elements.content.value = elements.content.value.replace(pattern, replacement);
    setMarkdownContent(elements.content.value);
  };

  const handleAdd = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const elements = getFormElements();
    if (!elements) return;
    if((elements.newLocationCoords.value !== '' ||
      elements.newLocationTitle.value !== '')
       && !confirm('Location data present?')) return;
       
    // take content from locationContent if content is empty
    if (elements.content.value === '' && elements.locationContent.value !== '') {
      try {
        const locations = JSON.parse(elements.locationContent.value);
        if (locations[0]?.title) {
          elements.content.value = locations[0].title;
        }
      } catch (error) {
        console.error('Failed to parse locations:', error);
      }
    }

    setIsLoading(true);
    try {
      // Validate location content
      if (elements.locationContent.value) {
        const locations = JSON.parse(elements.locationContent.value);
        if (!Array.isArray(locations)) {
          throw new Error('Locations must be an array');
        }
        
        locations.forEach(loc => {
          if (!loc.title || typeof loc.lat !== 'number' || typeof loc.lng !== 'number') {
            throw new Error('Invalid location format');
          }
          loc.title = loc.title.trim();
        });
        
        elements.locationContent.value = JSON.stringify(locations);
      }

      const entry = {
        content: elements.content.value,
        date: elements.dateInput.value,
        locations: elements.locationContent.value,
      };

      const response = await fetch(`${REST_ENDPOINT}/api/posts/`, {
        method: 'POST',
        body: JSON.stringify(entry),
        mode: 'cors',
        headers: createHeaders(),
      });

      const { id } = await response.json();

      onSuccess(`Add Done : New Id: ${id}`, {
        id,
        content: elements.content.value.trim(),
        date: elements.dateInput.value,
        locations: elements.locationContent.value,
      });
    } catch (error) {
      console.error(error);
      toast((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const checkKeyPressed = (e: KeyboardEvent) => {
    if (e.altKey && e.key === 's') {
      document.getElementById('saveBtn')?.click();
    } else if (e.key === 'Escape') {
      document.getElementById('cancelBtn')?.click();
    }
  };

  useEffect(() => {
    const elements = getFormElements();
    if (elements?.content) {
      elements.content.focus();
    }

    if (!isMounted.current) {
      isMounted.current = true;
      document.addEventListener('keydown', checkKeyPressed as any);
      return () => document.removeEventListener('keydown', checkKeyPressed as any);
    }
  }, []);

  return { formRef, handleAdd, textChange, markdownContent, isLoading };
};

export default useAddForm;
