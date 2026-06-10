export const useStorage = () => {
    //fonction pour enregistrer dans le localStorage
  const enregistrerDansLocalStorage = (cle, valeur) => {
    if (!process.client) return
    try { localStorage.setItem(cle, JSON.stringify(valeur)) } catch (e) {}
  }

  return {
    enregistrerDansLocalStorage
  }
}
