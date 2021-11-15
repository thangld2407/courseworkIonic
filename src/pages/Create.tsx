import { IonBackButton, IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToast, IonToolbar, useIonAlert, useIonToast } from "@ionic/react";
import { addCircleOutline as add } from 'ionicons/icons'

import './Home.css';

import { createRoom } from "../databaseHandle";
import { useState } from "react";
import { useHistory } from "react-router";

export function isEmptyOrWhiteSpace(value: string) {
  const re = /^\s*$/;
  return re.test(value);
}

export function isNumber(value: string) {
  const re = /^[1-9][0-9]*$/;
  return re.test(value);
}

export function validateDate(value: string) {
  const re = /^\d{4}[\/.]\d{1,2}[\/.]\d{1,2}$/;
  return re.test(value);
}
function validateForm(Form: any) {
  const properties = ['Flat', 'House', 'Bungalow'];
  const bedrooms = ['Studio', 'One', 'Two'];
  const furnished = ['Furnished', 'Unfurnished', 'PartFunished'];

  let isValidated = [];

  for (const key in Form) {
    if (Object.prototype.hasOwnProperty.call(Form, key)) {
      const el = Form[key];
      switch (key) {
        case 'monthlyRentPrice': {
          if (!isNumber(el)) {
            isValidated.push('You need to enter monthly rent price');
          }
          break;
        }
        case 'dateTime': {
          if (!validateDate(el)) {
            isValidated.push('You need to enter Date Time')
          }
          break;
        }
        case 'notes': {

          break;
        }
        case 'properties': {
          if (!properties.includes(el)) {
            isValidated.push('You need to enter type of Houses');
          }
          break;
        }
        case 'bedrooms': {
          if (!bedrooms.includes(el)) {
            isValidated.push('You need to enter type of Bedrooms');
          }
          break;
        }
        case 'furnished': {
          if (!furnished.includes(el)) {
            isValidated.push('You need to enter type of Furnitures');
          }
          break;
        }
        case 'reporter': {
          if (isEmptyOrWhiteSpace(el)) {
            isValidated.push('You need to enter name of Reporter');
          }
          break;
        }
        // default:{
        //   isValidate.push(false);
        // }
      }
    }
  }
  return isValidated;
}
function convertDate(date: string) {
  if (!date) {
    return '';
  }

  const newDate = new Date(date);

  const year = newDate.getFullYear();
  const month = (newDate.getMonth() + 1);
  const day = newDate.getDate();


  return mergeDate(year, month, day);
};

function mergeDate(year: number, month: number, date: number) {
  if (!year && !month && !date) {
    return '';
  }

  return `${year}/${month}/${date}`;
};

function notiError(err: any) {
  const message = err.join(`<br>`);

  return `${message}`;
}

const Create: React.FC = () => {
  const [properties, setProperties] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [dateTime, setDateTime] = useState(new Date().toISOString());
  const [monthlyRentPrice, setMonthlyRentPrice] = useState('');
  const [furnished, setFurnished] = useState('');
  const [notes, setNotes] = useState('');
  const [reporter, setReporter] = useState('');

  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [colorMessage, setColorMessage] = useState('');

  const history = useHistory();
  const [prensent] = useIonAlert();

  const addNewRoom = async () => {
    const newRoom = {
      properties,
      bedrooms,
      dateTime: convertDate(dateTime),
      monthlyRentPrice,
      furnished,
      notes,
      reporter
    };
    const validateFormAddNewRoom: any = validateForm(newRoom);

    if (validateFormAddNewRoom.length === 0) {
      prensent({
        header: 'Confirm Data',
        message: `
                  <p><b>Properties</b>: ${properties}</p>
                  <p><b>Bedrooms</b>: ${bedrooms}</p>
                  <p><b>Create at: </b>${convertDate(dateTime)}</p>
                  <p><b>Monthly Rent Price: </b>${monthlyRentPrice}</p>
                  <p><b>Furnished: </b>${furnished}</p>
                  <p><b>Notes: </b>${notes}</p>
                  <p><b>Reporter: </b>${reporter}</p>
        `,
        buttons: [
          'No',
          {
            text: 'Yes', handler: async (d) => {
              await createRoom(newRoom);
              setMessage('Created a new rooom');
              setShowToast(true);
              setColorMessage('success');
              
              setTimeout(() => {
                setShowToast(false);
              }, 3000);
        
              history.push('/home');
            }
          }
        ],
      })
    } else {
      setMessage(notiError(validateFormAddNewRoom));
      setShowToast(true);
      setColorMessage('warning');

      setTimeout(() => {
        setShowToast(false);
      }, 3000)
    }
  }
  return (
    <IonPage>
      <IonHeader translucent>
      <IonToolbar>
          <div className="header-style">
            <IonButton color="light" mode="ios">
              <IonBackButton />
            </IonButton>
            <IonTitle>Create New Room</IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonItem>
            <IonLabel position="floating">Property Type</IonLabel>
            <IonSelect onIonChange={e => setProperties(e.detail.value)}>
              <IonSelectOption value="Flat">Flat</IonSelectOption>
              <IonSelectOption value="House">House</IonSelectOption>
              <IonSelectOption value="Bungalow">Bungalow</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Bedroom</IonLabel>
            <IonSelect onIonChange={e => setBedrooms(e.detail.value)} >
              <IonSelectOption value="One">One</IonSelectOption>
              <IonSelectOption value="Studio">Studio</IonSelectOption>
              <IonSelectOption value="Two">Two</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Choose Date Time</IonLabel>
            <IonDatetime onIonChange={e => setDateTime(e.detail.value!)} displayFormat="YYYY/MM/DD"></IonDatetime>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Monthly rent price</IonLabel>
            <IonInput onIonChange={e => setMonthlyRentPrice(e.detail.value!)} type="number" required></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Furniture Type</IonLabel>
            <IonSelect onIonChange={e => setFurnished(e.detail.value)} >
              <IonSelectOption value="Furnished">Furnished</IonSelectOption>
              <IonSelectOption value="PartFunished">Part Furnished</IonSelectOption>
              <IonSelectOption value="Unfurnished">Unfurnished</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Notes</IonLabel>
            <IonTextarea onIonChange={e => setNotes(e.detail.value!)} placeholder="Optional"></IonTextarea>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Reporter</IonLabel>
            <IonInput onIonChange={e => setReporter(e.detail.value!)} type="text"></IonInput>
          </IonItem>
          <IonButton fill="solid" expand="block" className="btn-create" onClick={addNewRoom}>
            <IonIcon icon={add} /> Create
          </IonButton>
        </IonList>
      </IonContent>
      <IonToast
        message={message}
        isOpen={showToast}
        position="bottom"
        color={colorMessage}
      />
    </IonPage>
  );
};

export default Create;