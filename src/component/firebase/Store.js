import React, { useEffect, useState, Fragment } from "react";
//Hook y archivo config de firebase
import { useFirebase } from "../../hook/useFirebase";
import firebaseConfig from "../../utils/firebase";
//Alert de boostrap
import Alert from "bootstrap/js/dist/alert";
//faker datos
import { useFaker } from "react-fakers";

const Store = () => {
  const [data, setData] = useState();
  const base = useFirebase(firebaseConfig);
  const { success, error, loading } = useFaker({
    type: "users",
    params: { users: { quantity: 5 } },
    options: { limit: 3 },
  });

  function userRandom() {
    let result = { err: null, data: null };
    let dataAll = [];
    try {
      success.forEach((el) => {
        //console.log(el);
        dataAll.push(el);
      });
      result.data = dataAll;
    } catch (error) {
      result.err = error;
    }
    return result;
  }

  function addDoc(data) {
    base.addDocument("editorial", data).then((result) => {
      console.log(result);
      if (result.err != null) return toast(result.err);
      toast("Document was created with the methods addDoc");
    });
  }

  function setDoc(data) {
    base.setDocument("editorial", "author", data).then((result) => {
      console.log(result);
      if (result.err != null) return toast(result.err);
      toast("Document was created with the methods setDoc");
    });
  }

  function mergeDoc() {
    base
      .mergeDocument("editorial", "author", {
        sale: 1500,
      })
      .then((result) => {
        console.log(result);
        if (result.err != null) return toast(result.err);
        toast("Document has been merged.");
      });
  }
  function update() {
    base
      .update("editorial", "author", {
        sale: 220000,
      })
      .then((result) => {
        console.log(result);
        if (result.err != null) return toast(result.err);
        toast("Document has been updated.");
      });
  }

  function delByKey() {
    base.deleteByKey("editorial", "author", "sale").then((result) => {
      console.log(result);
      if (result.err != null) return toast(result.err);
      toast("Value has been deleted");
    });
  }
  function delDoc() {
    base.deleteDocument("editorial", "author").then((result) => {
      console.log(result);
      if (result.err != null) return toast(result.err);
      toast("Document has been deleted. ");
    });
  }
  function getDoc() {
    base.getDocumentId("editorial", "author").then((result) => {
      console.log(result);
      if (result.err != null) return toast(result.err);
      setData(result.data);
    });
  }

  function getDocAll() {
    base.getDocuments("editorial", "author").then((result) => {
      console.log(result);
      if (result.err != null) return toast(result.err);
      setData(result.data);
    });
  }
  function getDocFilter() {
    const sentence = { key: "sale", operator: ">", value: 0 };
    base.documentFilter("editorial", sentence).then((result) => {
      console.log(result);
      if (result.err != null) return toast(result.err);
      setData(result.data);
    });
  }
  function toast(text) {
    let al = document.querySelector("#containerAlert");
    al.innerHTML = `<div class="alert alert-primary alert-dismissible fade show" role="alert" style='width: 90%; position:fixed;z-index:999 '>
     ${text} 
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
  }
  const area = {
    color: "white",
    backgroundColor: "black",
    padding: "10px",
    fontFamily: "Arial",
    width: "95%",
    height: "350px",
    overflow: "auto",
  };

  return (
    <Fragment>
      <div className="row">
        <div className="col">
          <div
            className=" d-flex justify-content-center"
            id="containerAlert"
          ></div>
        </div>
      </div>

      <div className="row justify-content-center mt-5">
        <div className="col-12">
          <h4 className="text-center text-muted  m-3"> Crear Documentos</h4>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Documentos con nombre automaticos</h5>
              <h6 className="card-subtitle mb-2 text-muted ">
                <kbd>collection/&#123;id-doc-automatic&#125;/dataDoc</kbd>
              </h6>
              <div className="card-text">
                Firebase por defecto puede generar automaticamente los nombres o
                identificadores de un documento. Para ello el hook firebase usa
                internamente el metodo addDoc que sirve para crear documentos
                nuevos . En nuestro ejemplo, creara la colección llamada{" "}
                <strong>editorial</strong>, con un nombre de documento
                automatico, acompañado de la data que se quiere almacenar.
              </div>
            </div>
            <div className="card-footer">
              <div className="d-grid gap-2 ">
                <button
                  className="btn btn-primary btn-block btn-lg mt-3 btn-success"
                  onClick={() => {
                    let users = userRandom(); //crea usuarios aleatorios
                    addDoc(...users.data);
                  }}
                >
                  Create Document
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Documentos con nombre propio</h5>
              <h6 className="card-subtitle mb-2 text-muted ">
                <kbd> collection/&#123;id-doc-custom&#125;/dataDoc</kbd>
              </h6>
              <div className="card-text">
                En firebase se pueden crear nombres de documentos
                personalizados, para ello el hook internamente utiliza el metodo
                setDoc, el cual sirve para definir un nombre al documento y
                crearlo. Ahora bien, una vez ya creado el documento, si se
                enviara nueva data utilizando este metodo, la data anterior
                seria eliminada por la actual. Por lo tanto, el metodo setDoc no
                debe usarse como metodo de actualizacion, para ello tendremos
                otros metodos mas apropiados. En nuestro ejemplo, se creara una
                colección llamada: <strong>editorial</strong>, con el nombre de
                documento llamado:
                <strong> author</strong>, viendose de la siguiente forma:
                <p>
                  <strong>editorial/autor/dataDoc</strong>
                </p>
              </div>
            </div>
            <div className="card-footer">
              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary btn-block btn-lg mt-3 btn-success"
                  onClick={() => {
                    let users = userRandom(); //crea usuarios aleatorios
                    setDoc(...users.data);
                  }}
                >
                  Create Document
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col">
          <h4 className="text-center text-muted  m-3">
            {" "}
            Actualizar Documentos
          </h4>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Combinar datos</h5>
              <h6 className="card-subtitle mb-2 text-muted ">
                <kbd>collection/id-doc/&#123;clave:valor&#125;</kbd>
              </h6>
              <div className="card-text">
                En firebase se puede combinar nuevos datos "clave:valor" con los
                ya existentes en el documento , y si la clave existe, se
                remplazara con los nuevos valores. El hook internamente usa el
                metodo setDoc, con una option <strong>merge en true</strong>,
                para realizar la mezcla. En nuestro ejemplo se combinara la
                clave valor:{" "}
                <span className="fw-bold"> &#123;sale:1500&#125;</span>
              </div>
            </div>
            <div className="card-footer">
              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary btn-block btn-lg mt-3 btn-primary"
                  onClick={mergeDoc}
                >
                  Merge Data
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Actualizar valor de una clave</h5>
              <h6 className="card-subtitle mb-2 text-muted ">
                <kbd> collection/id-doc/&#123;clave:valor&#125;</kbd>
              </h6>
              <div className="card-text">
                En firebase se puede actualizar especificamente un valor de una
                clave contenido en un documento, el hook internamente usa el
                metodo <strong>updateDoc</strong>, el cual , actualiza un campo
                en especifico , y sino existe lo crea, sin alterar la estructura
                de los datos existentes. En nuestro ejemplo se actualizara la
                clave
                <span className="fw-bold"> sale</span> por el valor{" "}
                <span className="fw-bold"> 20000</span>
              </div>
            </div>
            <div className="card-footer">
              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary btn-block btn-lg mt-3 btn-primary"
                  onClick={update}
                >
                  Update Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col">
          <h4 className="text-center text-muted  m-3">
            {" "}
            Eliminar Datos y Documentos
          </h4>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Borrar una campo por su clave</h5>
              <h6 className="card-subtitle mb-2 text-muted ">
                <kbd>collection/id-doc/clave</kbd>
              </h6>
              <div className="card-text">
                En firebase se puede borrar campos especificos de un documento,
                definiendo la clave del campo. En nuestro ejemplo se borrara el
                campo con clave llamado: <span className="fw-bold">sale</span>.
              </div>
            </div>
            <div className="card-footer">
              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary btn-block btn-lg mt-3 btn-danger"
                  onClick={delByKey}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Eliminar un documento</h5>
              <h6 className="card-subtitle mb-2 text-muted ">
                <kbd> collection/id-doc/</kbd>
              </h6>
              <div className="card-text">
                En firebase se puede eliminar documentos especificos definiendo
                su identificador. con lo cual, el hook utiliza el metodo
                deleteDoc internamente, es necesario mencionar que si el
                documento tiene embebido otros documentos, estos no son
                borrados, y segun la documentacion de firebase, deben eliminarse
                desde el administrador o usando comandos de cli manualmente. En
                nuestro ejemplo se eliminara el documento autor.
              </div>
            </div>
            <div className="card-footer">
              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary btn-block btn-lg mt-3 btn-danger"
                  onClick={delDoc}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col">
          <h4 className="text-center text-muted m-3"> Leer Documentos</h4>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">
                Obtener un documento especifico de una coleccion
              </h5>
              <h6 className="card-subtitle mb-2 text-muted ">
                <kbd> collection/id-doc/&#123;clave:valor&#125;</kbd>
              </h6>
              <div className="card-text">
                En firebase se puede hacer una lectura de los datos de un
                documento especifico , mediante el metodo getDoc. Conociendo la
                ruta de acceso al documento. En nuestro ejemplo se leera los
                datos de la colección:
                <span className="fw-bold"> editorial/autor</span>
              </div>
            </div>
            <div className="card-footer">
              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary btn-block btn-lg mt-3 btn-warning"
                  onClick={getDoc}
                >
                  Get document
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">
                Obtener todos los documentos de una coleccion
              </h5>
              <h6 className="card-subtitle mb-2 text-muted ">
                <kbd> collection/id-doc/&#123;clave:valor&#125;</kbd>
              </h6>
              <div className="card-text">
                En firebase se puede leer todos los documentos de una colección,
                similar hacer un <span className="fw-bold"> select * </span>en
                bases de datos relacionales, con la diferencia que en un
                ambiente NoSQL, no es posible hacer una pre seleccion de los
                campos <span className="fw-bold">claves-valor </span>, con lo
                cual se extraen todos los datos, aunque no se vayan a requerir
                todos, por ende, debe diseñarse bases de datos eficientes que
                contemplen consumir los datos que se pidan, evitando consumos
                innecesarios en ancho de banda para los clientes, y facturacion
                excesiva en firebase por el uso de la misma.
              </div>
            </div>
            <div className="card-footer">
              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary btn-block btn-lg mt-3 btn-warning"
                  onClick={getDocAll}
                >
                  Get all document
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">
                Obtener todos los documentos que cumplen una sentencia
              </h5>
              <h6 className="card-subtitle mb-2 text-muted ">
                <kbd> collection/id-doc/</kbd>
              </h6>
              <div className="card-text">
                En firebase se puede leer y extraer todos los datos de los
                documentos que cumplan los requisitos de busqueda, para ello el
                hook usa internamente la clausulas where, similar a SQL. Lo cual
                se realizara de manera secuencial comparando en todos los
                documento si existe la clave de busqueda, y si existe, valida si
                la condicion se cumple. En nuestro ejemplo, buscara la clave{" "}
                <span className="fw-bold">sale>0</span> en todos los documentos,
                y con certeza sabemos que la clave sale, solo existe en el
                documento autor, con lo cual devolvera su data respectiva.
              </div>
            </div>
            <div className="card-footer">
              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary btn-block btn-lg mt-3 btn-warning"
                  onClick={getDocFilter}
                >
                  Document Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row justify-content-center mt-5 mb-5">
        <div className="col-md-8 d-flex justify-content-center">
          <div style={area}>{JSON.stringify(data)}</div>
        </div>
      </div>
    </Fragment>
  );
};

export default Store;
