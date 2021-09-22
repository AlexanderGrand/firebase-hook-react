import React, { useState } from "react";
import { getApp, initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  addDoc,
  getDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  connectFirestoreEmulator,
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  connectAuthEmulator,
  User,
} from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

let db = null,
  functions = null,
  auth = null,
  app = null;

export const useFirebase = (config) => {
  let connect = { err: null };

  function configEnv() {
    if (typeof config == "object") {
      if (Object.keys(config).length > 0) {
        if (app == null) {
          try {
            app = initializeApp(config);
            if (process.env.NODE_ENV === "development") {
              //Modo desarrollo se ejecuta en cuando se lanza npm start o yarn
              db = getFirestore();
              auth = getAuth();
              // functions = getFunctions(getApp());
              //connectFunctionsEmulator(functions, "localhost", 5001);
              connectAuthEmulator(auth, "http://localhost:9099/", {
                disableWarnings: true,
                onAuthStateChangedMutation: null,
              });
              connectFirestoreEmulator(db, "localhost", 8080, {
                enablePersistence: {
                  synchronizeTabs: true,
                },
              });
              connect.status = "development";
            } else if (process.env.NODE_ENV === "production") {
              //modo produccion se ejecuta cuando se activa npm run build
              db = getFirestore(app);
              auth = getAuth(app);
              connect.status = "production";
            }
          } catch (error) {
            console.log("catch Erro: ", error);
            connect.err = error;
          }
        }
      } else {
        connect.err = "Firebase file is empty.";
      }
    } else {
      connect.err = "Firebase file incorrect.";
    }
  }
  configEnv();

  async function addDocument(colName, data) {
    // Crea un documento nuevo con un id automatico unico
    let result = { err: null, status: null };
    result.err = connect.err;
    if (result.err != null) {
      return result;
    }
    try {
      if (typeof data == "object") {
        const docRef = await addDoc(collection(db, colName), data);
        result.status = docRef.id;
      } else {
        result.err = "Error data";
      }
    } catch (error) {
      result.err = error;
    }
    return result;
  }
  async function setDocument(colName, idDoc, data) {
    //crea un documento nuevo o remplaza el existente con los nuevos datos
    let result = { err: null, status: null };
    result.err = connect.err;
    if (result.err != null) {
      return result;
    }
    try {
      if (typeof data == "object") {
        await setDoc(doc(db, colName, idDoc), data);
        result.status = true;
      } else {
        result.err = "Error data";
      }
    } catch (error) {
      result.err = error;
    }
    return result;
  }
  async function mergeDocument(colName, idDoc, data) {
    //combina nuevos campos a un documento con campos existentes
    let result = { err: null, status: null };
    result.err = connect.err;
    if (result.err != null) {
      return result;
    }
    try {
      if (typeof data == "object") {
        const ref = doc(db, colName, idDoc);
        setDoc(ref, data, { merge: true });
        result.status = true;
      } else {
        result.err = "Error data";
      }
    } catch (error) {
      result.err = error;
    }

    return result;
  }

  async function update(colName, idDoc, data) {
    let result = { err: null, status: null };
    result.err = connect.err;
    if (result.err != null) {
      return result;
    }
    try {
      if (typeof data == "object") {
        const ref = doc(db, colName, idDoc);
        await updateDoc(ref, data);
        result.status = "Field updated";
      } else {
        result.err = "Error data";
      }
    } catch (error) {
      result.err = error;
    }

    return result;
  }
  async function deleteDocument(colName, idDoc) {
    //borra todos los dados menos las sub colecciones
    let result = { err: null, status: null };
    result.err = connect.err;
    if (result.err != null) {
      return result;
    }
    try {
      const ref = doc(db, colName, idDoc);
      await deleteDoc(ref);
      result.status = true;
    } catch (error) {
      result.err = error;
    }
    return result;
  }
  async function deleteByKey(colName, idDoc, key) {
    //borrar campos especificos
    let result = { err: null, status: null },
      obj = {};
    result.err = connect.err;
    if (result.err != null) {
      return result;
    }
    try {
      if (typeof key == "string") {
        obj[key] = deleteField();
        const ref = doc(db, colName, idDoc);
        await updateDoc(ref, obj);
        result.status = true;
      } else {
        result.err = "Error data";
      }
    } catch (error) {
      result.err = error;
    }
    return result;
  }

  async function getDocumentId(colName, idDoc) {
    //no recupera las sub colecciones solo los documentos raiz
    let result = { err: null, data: null };
    result.err = connect.err;
    if (result.err != null) {
      return result;
    }
    try {
      const docRef = doc(db, colName, idDoc);
      const doc_ = await getDoc(docRef);
      if (doc_.exists()) {
        result.data = doc_.data();
      } else {
        result.err = "No document";
      }
    } catch (error) {
      result.err = error;
    }
    return result;
  }
  async function getDocuments(colName) {
    //recupera todos documentos de la colleccion
    let result = { err: null, data: null };
    let allDocs = [];
    result.err = connect.err;
    if (result.err != null) {
      return result;
    }
    try {
      const ds = await getDocs(collection(db, colName));
      if (ds.size > 0) {
        ds.forEach((doc) => {
          if (typeof doc.data() != "undefined") {
            allDocs.push(doc.data());
          } else {
            result.err = "No document";
          }
        });
        result.data = allDocs;
      } else {
        result.err = "No documents";
      }
    } catch (error) {
      result.err = error;
    }
    return result;
  }
  async function documentFilter(colName, sentence) {
    let arr = [];
    let result = { err: null, data: null };
    result.err = connect.err;
    if (result.err != null) {
      return result;
    }
    try {
      const q = query(
        collection(db, colName),
        where(sentence.key, sentence.operator, sentence.value)
      );
      const ds = await getDocs(q);
      console.log(ds);
      if (ds.size > 0) {
        ds.forEach((doc) => {
          if (doc.exists()) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            arr.push({ id: doc.id, value: doc.data() });
          } else {
            result.err = "Document no exist";
          }
        });
        result.data = arr;
      } else {
        result.err = "Sentence did not yield results";
      }
    } catch (error) {
      result.err = error;
    }
    return result;
  }

  return {
    addDocument,
    setDocument,
    mergeDocument,
    update,
    getDocumentId,
    getDocuments,
    deleteDocument,
    deleteByKey,
    documentFilter,
  };
};
