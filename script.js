function addWorkCard(params) {
  // pongo las llaves para q no me tire error, las llaves significan que si no hay parametro, pasa esas llaves por defecto
  // consigo el template y lo selecciono, el template esta fuera de la section, por eso tengo que -->
  const template = document.querySelector("#portfolio-cards-template");
  //seleccionar el contenedor para despues poner la clonacion dentro del contenedor, aca es donde generamos las cards
  const contenedor = document.querySelector(".portfolio-content");

  //aca selecciono cada parte del template, por ejemplo, la foto, el titulo, el parrafo y el link
  template.content.querySelector(".portfolio-img").src = params.image;

  template.content.querySelector(".portfolio-card-title").textContent =
    params.title;

  template.content.querySelector(".portfolio-card-parrafo").textContent =
    params.parrafo;

  template.content.querySelector(".portfolio-card-link").href = params.link;

  // clono el contenido del template
  const clone = document.importNode(template.content, true);
  // y lo agrego al contenedor con el metodo appendChild
  contenedor.appendChild(clone);
}

function getWork() {
  // tiene que devolver una promesa para que en el main, le ponga el then de esa promesa
  return fetch(
    "https://cdn.contentful.com/spaces/hzma5z61vjs4/environments/master/entries?access_token=6l3gfvRte1iRjrtVzhiTZ39sh-SehCkKxWm3md44ozU"
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log(data.includes.Asset[0]);
      const arrObj = data.items.map((i) => {
        let cont = 0;
        return {
          title: i.fields.titulo,
          parrafo: i.fields.descripcion,
          link: i.fields.url,
          imageID: i.fields.imagen.sys.id,
          includes: data.includes.Asset,
        };
      });
      arrObj.forEach((e) => {
        let idEncontrado = buscarAsset(e.imageID, e.includes);
        e.image = "https:" + idEncontrado.fields.file.url;
      });
      return arrObj;
    });
}

function buscarAsset(assetID, includes) {
  const imagen = includes.find((i) => {
    return i.sys.id == assetID;
  });
  return imagen;
}

function main() {
  getWork().then(function (works) {
    // y cuando termine de ejecutarse la promesa voy a recibir works, y eso lo voy a iterar uno por uno y lo voy a pasar a la funcion addWorkCard
    for (const w of works) {
      addWorkCard(w);
    }
  });
}

main();
