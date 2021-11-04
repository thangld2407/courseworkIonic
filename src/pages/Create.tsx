import { IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToast, IonToolbar, useIonToast } from "@ionic/react";
import { addCircleOutline as add, bed } from 'ionicons/icons'

import './Home.css';

import { createRoom } from "../databaseHandle";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router";

export function validateEmptyOrWhiteSpace(value: string) {
    const re = /^\s*$/;
    return re.test(value);
  }


export function validateNumber(value: string) {
  const re = /^\d+$/;
  return re.test(value);
}

export function validateDate(value: string) {
  const re = /^\d{4}[\/.]\d{1,2}[\/.]\d{1,2}$/;
  return re.test(value);
}

function convertDate(date: string) {
  if (!date) {
    return '';
  }

  const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = (newDate.getMonth() + 1);
  const day = newDate.getDay();
  

  return mergeDate(year, month, day);
};

function mergeDate(year: number, month: number, date: number) {
  if (!year && !month && !date) {
    return '';
  }

  return `${year}/${month}/${date}`;
};

/**
 * Validate Form
 * @param Form 
 * @returns Array item error
 */

function validateForm(Form:any){
  const properties = ['Flat', 'House', 'Bungalow'];
  const bedrooms = ['Studio', 'One', 'Two', 'Other'];
  const furnished = ['Furnished', 'Unfurnished', 'PartFunished'];

 let isValidate = [];

 for(const key in Form ) {
   if(Object.prototype.hasOwnProperty.call(Form, key)){
     const el = Form[key];
     switch (key) {
        case 'monthlyRentPrice': {
          if(!validateNumber(el)){
            isValidate.push('monthly Rent Price ');
          } 
           break;
        }
        case 'dateTime': {
          if(!validateDate(el)){
            isValidate.push('Date Time ')
          }
          break;
        }
        case 'notes':{

          break;
        }
        case 'houses':{
          if(!properties.includes(el)){
            isValidate.push('Houses');
          }
          break;
        }
        case 'bedrooms':{
          if(!bedrooms.includes(el)){
            isValidate.push('Bedrooms');
          }
          break;
        }
        case 'furnitures':{
          if(!furnished.includes(el)){
            isValidate.push('Furnitures');
          }
          break;
        }
        case 'reporter':{
            if(validateEmptyOrWhiteSpace(el)){
                isValidate.push('Reporter');
            }
            break;
        }
        // default:{
        //   isValidate.push(false);
        // }
     }
   }
 }
 return isValidate;
}

function createMessageError(listError: any) {
  const message = listError.join(', ');

  return `You entered ${message} incorrectly`;
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
    
    const addNewRoom = async () => {
        const newRoom = {
            properties: properties,
            bedrooms: bedrooms,
            dateTime: convertDate(dateTime),
            monthlyRentPrice: monthlyRentPrice,
            furnished: furnished,
            notes: notes,
            reporter: reporter,
        };
        const validateFormAddNewRoom:any = validateForm(newRoom);

        if(validateFormAddNewRoom.length === 0) {
            
          setMessage('You created a new room' );
          setShowToast(true);
          setColorMessage('success');
          await createRoom(newRoom);
          history.goBack();

          setTimeout(()=> {
            setShowToast(false);
          }, 3000)
        } else {
          setMessage(createMessageError(validateFormAddNewRoom));
          setShowToast(true);
          setColorMessage('warning');
    
          setTimeout(()=> {
            setShowToast(false);
          }, 3000)
        }
    }
    return (
        <IonPage>
            <IonHeader translucent>
                <IonToolbar>
                    <IonTitle>Create New Room</IonTitle>
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
                        <IonSelect onIonChange ={e => setBedrooms(e.detail.value)} >
                            <IonSelectOption value="One">One</IonSelectOption>
                            <IonSelectOption value="Studio">Studio</IonSelectOption>
                            <IonSelectOption value="Two">Two</IonSelectOption>
                            <IonSelectOption value="other">Other</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Choose Date Time</IonLabel>
                        <IonDatetime onIonChange={e => setDateTime(e.detail.value!)} displayFormat="YYYY/MM/DD"></IonDatetime>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Monthly rent price</IonLabel>
                        <IonInput onIonChange ={e => setMonthlyRentPrice(e.detail.value!)} type="number" required></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Furniture Type</IonLabel>
                        <IonSelect onIonChange ={e => setFurnished(e.detail.value)} >
                            <IonSelectOption value="Furnished">Furnished</IonSelectOption>
                            <IonSelectOption value="Part Furnished">Part Furnished</IonSelectOption>
                            <IonSelectOption value="Unfurnished">Unfurnished</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Notes</IonLabel>
                        <IonTextarea onIonChange ={e => setNotes(e.detail.value!)} placeholder="Optional"></IonTextarea>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Reporter</IonLabel>
                        <IonInput onIonChange ={e => setReporter(e.detail.value!)} type="text"></IonInput>
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