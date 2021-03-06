// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
console.log('wha');

let trigID = 0;
function chromecastPicker() {
    console.log('CHROMECAST JS LOADED')
    let dialog = document.createElement('paper-dialog');
    trigID++;
    const body = document.getElementsByTagName('body')[0];
    const title = 'Choose Cast Device'; // TODO: New translate key needed
    const h3 = document.createElement('h3');
    h3.textContent = title;
    dialog.appendChild(h3);

    const listContainer = document.createElement('paper-listbox');
    receivers.forEach((receiver) => {
      const cast = document.createElement('paper-item');
      cast.textContent = receiver.friendlyName;
      cast.setAttribute('data-reciever-id', `${receiver.ipAddress}_${receiver.port}_${trigID}`);
      listContainer.appendChild(cast);
      document.body.addEventListener('click', (e) => {
        if (!dialog || !dialog.opened) return;
        if (e.target.getAttribute('data-reciever-id') === `${receiver.ipAddress}_${receiver.port}_${trigID}`) {
          dialog.close();
          dialog.parentNode.removeChild(dialog);
          dialog = null;
          resolve(receiver);
        }
      });
    });
    dialog.appendChild(listContainer);

    listContainer.style.display = 'block';
    listContainer.style.maxHeight = '50vh';
    listContainer.style.overflowY = 'auto';

    dialog.innerHTML += `
    <div class="buttons">
      <paper-button data-cancel dialog-dismiss>Cancel</paper-button>
      <paper-button data-stop-cast dialog-dismiss>Stop</paper-button>
    </div>`;

    // Handle Close and Cancel Buttons
    const closeHandler = (e) => {
      if (!dialog) {
        return;
      } else if (!dialog.opened) {
        dialog.parentNode.removeChild(dialog);
        dialog = null;
        document.body.removeEventListener('mousedown', closeHandler);
        return;
      }
      if (e.target.hasAttribute('data-stop-cast')) {
        reject('STOP');
      } else if (e.target.hasAttribute('data-cancel')) {
        reject('CANCEL');
      }
    };
    document.body.addEventListener('mousedown', closeHandler);

    body.appendChild(dialog);

    dialog.alwaysOnTop = true;
    dialog.withBackdrop = true;
    dialog.toggle();
  }
//require('electron-chromecast')(receiverFn);
