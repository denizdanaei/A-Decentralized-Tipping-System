(function() {
    /**
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time.
     */
    if (window.hasRun) {
      return;
    }
    window.hasRun = true;
  
   
// Funtion to get a specifc meta value
function getPublicAddress() {
  console.log(document);
  const metas = document.getElementsByTagName('meta');
  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute('name') === 'Tudelft-tipping-extension') {
      return metas[i].getAttribute('content');
    }
  }
  return 'The public address of this webpage is not found';
}

 
  })();