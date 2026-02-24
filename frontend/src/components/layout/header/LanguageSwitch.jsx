import React from 'react';
import { Switch } from '@headlessui/react';

export default function LanguageSwitch({ language, setLanguage }) {
   console.log(language);
   
   return (
      <div className="flex items-center gap-1 justify-self-end">
         <span className="absolute left-2 text-xs pointer-events-none">
            🇫🇷
         </span>

         <Switch
         checked={language === 'fr'}
         onChange={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
         className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-white/10 data-focus:outline data-focus:outline-white"
         >
            <span
               aria-hidden="true"
               className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7"
            />
         </Switch>
         <span className="absolute right-2 text-xs pointer-events-none">
            🇬🇧
         </span>
      </div>
   )
}