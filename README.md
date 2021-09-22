# Laboratorio Firebase Store Hook, con React y Bootstrap 5

https://alexandergrand.github.io/firebase-hook-react/

## Laboratorio Firebase store utiliza la version 9.0.2 del api de firebase web. Y esta construido para realizar pruebas rapidas en un ambiente de desarrollo, pero antes se requiere instalar previamente firebase tools , el cual, contiene los emuladores para trabajar localmente.

```JAVASCRIPT
npm install -g firebase-tools
```

## Ademas, es necesario tener un proyecto creado en firebase store y obtener las propias credenciales del proyecto, y luego sustituirlas dentro la siguiente ruta:

src/util/firebase.js

```JAVASCRIPT
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

// Initialize Firebase
export default firebaseConfig;
```

## De tal manera, que cuando se ejecute el npm run build, pase de un entorno de desarrollo hacia un entorno de producción, es decir, ahora toda accion se realizara directamente sobre firebase cloud y no localmente. <br>

Sino se instala firebase tool ni el archivo config de firebase store cloud, la aplicacion no no realizara ningun interaccion, es decir, no mostrara ningun mensaje al pulsar los botones.

## El hook internamente contienen las operaciones sobre documentos tales como:

- Creacion de documentos con nombre con metodo setDoc
- Creacion de documentos con nombres auto generados con metodo addDoc
- Actualizacion de valores con metodo merge
- Actualizacion de valores con metodo updateDoc
- Eliminacion de valores especificos de un documento
- Eliminacion de documentos con el metodo deleteDoc
- Extraer datos de un documento especifico
- Extraer datos de todos los documentos.
- Extraer datos de todos los documentos con sentencias simples mediante el metodo where.
