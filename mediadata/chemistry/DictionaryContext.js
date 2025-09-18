import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getUserDictionary, addWordToUserDictionary } from "../../firebase/dictionaryService";

const DictionaryContext = createContext();

export const useDictionary = () => useContext(DictionaryContext);

export const DictionaryProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dictionary, setDictionary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    // Подписка на изменение состояния пользователя
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        setLoading(true);
        const userDict = await getUserDictionary();
        setDictionary(userDict);
        setLoading(false);
      } else {
        setDictionary({});
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const addWord = async (folderName, wordObj) => {
    if (!user) return;
    await addWordToUserDictionary(folderName, wordObj);
    // сразу обновляем локальный словарь
    setDictionary((prev) => ({
      ...prev,
      [folderName]: prev[folderName] ? [...prev[folderName], wordObj] : [wordObj],
    }));
  };

  return (
    <DictionaryContext.Provider value={{ dictionary, addWord, loading }}>
      {children}
    </DictionaryContext.Provider>
  );
};
