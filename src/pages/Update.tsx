import { IonBackButton, IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToast, IonToolbar, useIonToast } from "@ionic/react";
import { addCircleOutline as add, bed } from 'ionicons/icons'

import './Home.css';

import { createRoom, getOneRoom, deleteRoom, updateRoom } from "../databaseHandle";
import { Redirect, useHistory, useParams } from "react-router";
import { useEffect, useState } from "react";
import {Room} from '../room'
interface MyParams{
    id: string
}
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

const Update: React.FC = () => {
    const {id} = useParams<MyParams>();

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

    async function fetchData() {
        const room = await getOneRoom(Number.parseInt(id)) as Room;

        setProperties(room.properties);
        setBedrooms(room.bedrooms);
        setDateTime(room.dateTime);
        setFurnished(room.furnished);
        setMonthlyRentPrice(room.monthlyRentPrice);
        setReporter(room.reporter);
        setNotes(room.notes);
    }
    useEffect(() =>{
        fetchData();
    },[])
    const handleUpdate = async () => {
        const idRoom =  Number.parseInt(id);
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
          
          setMessage('You updated this room' );
          setShowToast(true);
          setColorMessage('success');
          await updateRoom(newRoom, idRoom);
        
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
                    <div className="header-style">
                        <IonButton color="light" mode="ios">
                            <IonBackButton className="text-color" /> 
                        </IonButton>
                        <IonTitle>Update New Room</IonTitle>
                    </div>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonList>
                    <IonItem>
                        <IonLabel position="floating">Property Type</IonLabel>
                        <IonSelect value={properties} onIonChange={e => setProperties(e.detail.value)}>
                            <IonSelectOption value="Flat">Flat</IonSelectOption>
                            <IonSelectOption value="House">House</IonSelectOption>
                            <IonSelectOption value="Bungalow">Bungalow</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Bedroom</IonLabel>
                        <IonSelect value={bedrooms} onIonChange ={e => setBedrooms(e.detail.value)} >
                            <IonSelectOption value="One">One</IonSelectOption>
                            <IonSelectOption value="Studio">Studio</IonSelectOption>
                            <IonSelectOption value="Two">Two</IonSelectOption>
                            <IonSelectOption value="Other">Other</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Choose Date Time</IonLabel>
                        <IonDatetime value={dateTime}  onIonChange={e => setDateTime(e.detail.value!)}  displayFormat="YYYY/MM/DD"></IonDatetime>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Monthly rent price</IonLabel>
                        <IonInput value={monthlyRentPrice} onIonChange ={e => setMonthlyRentPrice(e.detail.value!)} type="number" required></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Furniture Type</IonLabel>
                        <IonSelect value={furnished} onIonChange ={e => setFurnished(e.detail.value)} >
                            <IonSelectOption value="Furnished">Furnished</IonSelectOption>
                            <IonSelectOption value="Part Furnished">Part Furnished</IonSelectOption>
                            <IonSelectOption value="Unfurnished">Unfurnished</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Notes</IonLabel>
                        <IonTextarea value={notes} onIonChange ={e => setNotes(e.detail.value!)} placeholder="Optional"></IonTextarea>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Reporter</IonLabel>
                        <IonInput value={reporter} onIonChange ={e => setReporter(e.detail.value!)} type="text"></IonInput>
                    </IonItem>
                    <IonButton fill="solid" expand="block" className="btn-create" onClick={handleUpdate}>
                        <IonIcon icon={add} /> Update
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

export default Update;