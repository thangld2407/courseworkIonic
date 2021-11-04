import { IonAvatar, IonButton, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRefresher, IonRefresherContent, IonRow, IonSearchbar, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import { home as homeIcon, create as createIcon, home, add, close, createOutline, addCircle  } from 'ionicons/icons'

import './Home.css';

import { deleteRoom, getAllRoom } from '../databaseHandle';
import { Room } from '../room';
import { useEffect, useState } from 'react';
const Home: React.FC = () => {
  const [room, setRooms] = useState<Room[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  async function fetchData() {
    const allRoom = await getAllRoom();
    setRooms(allRoom);
  }
  useEffect(()=>{
    console.log('use effect')
    fetchData();
  },[]);

  async function handeDelete(id:number){
    const confirmDelete = window.confirm("Do you want to delete this room ?");

    if(confirmDelete){
      await deleteRoom(id);
      setMessage('You have deleted this room');
      setShowToast(true);
      
      setTimeout(()=>{
        setShowToast(false);
      },3000);
      await fetchData();
    }
  }

  return (
    <IonPage className="container-content">
      <IonHeader translucent>
        <div className="header">
          <IonGrid>
            <IonRow>
              <IonCol><h2>Manage Room Page</h2></IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonHeader>
      <IonContent className="ion-padding">
      {/* <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher> */}
      <IonGrid>
        <IonRow>
          <div className="search">
            <IonCol>
              <IonSearchbar></IonSearchbar>
            </IonCol>
          </div>
        </IonRow>
      </IonGrid>
      <IonGrid>
        <div className="content">
          {room &&
            room.map((listRoom, index)=>
            <IonCard key={index}>
              <IonCardHeader><h2>Room ID: {listRoom.id}</h2></IonCardHeader>
              <IonCardContent>

                  <IonRow>
                    <IonCol size="7" className="display-content">
                      <p> Property Type: </p>
                      <p> Bed Rooms: </p> 
                      <p> Date Time Adding: </p> 
                      <p> Monthly Rent Price: </p> 
                      <p> Furniture Types: </p> 
                      <p> Notes: </p>
                      <p> Name Reporter: </p>
                    </IonCol>
                    <IonCol size="5" className="display-detail">
                      <p>{ listRoom.properties }</p>
                      <p>{ listRoom.bedrooms }</p>
                      <p>{ listRoom.dateTime }</p>
                      <p>{ listRoom.monthlyRentPrice}</p>
                      <p>{ listRoom.furnished }</p>
                      <p>{ listRoom.notes }</p>
                      <p>{ listRoom.reporter }</p>
                    </IonCol>
                  </IonRow>
              </IonCardContent>
              <IonRow>
                <IonCol className="btn-icon">
                  <div className="btn-icon">
                    <IonButton routerLink={`update/${listRoom.id}`}>
                      <IonIcon icon={createOutline} />
                    </IonButton>
                  </div>
                </IonCol>
                <IonCol className="btnicon">
                  <div className="btn-icon">
                    <IonButton color="danger" onClick={()=> handeDelete(listRoom.id || 1)}>
                      <IonIcon icon={close} />
                    </IonButton>
                  </div>
                </IonCol>
              </IonRow>
            </IonCard>
            )}
        </div>
      </IonGrid>
      </IonContent>
      <IonFooter>
        <div className="footer">
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton expand="full" shape="round" href="/home" >
                  <IonIcon icon={home} /> Home
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton expand="full" color="warning" shape="round" href="/create">
                  <IonIcon icon={addCircle} /> Creat 
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
        <IonToast isOpen={showToast} message={message} color="success" position="bottom"></IonToast>
      </IonFooter>
    </IonPage>
  );
};

export default Home;
