import './App.css';
// import PetRegistrationForm from './Component/PetRegistrationForm';
import DogFoodRoutineTable from './Component/DogFoodRoutineTable';

function App() {
  return (
    <div className="App">
      {/* <PetRegistrationForm/> */}
      <DogFoodRoutineTable dogIndex={4}/>
    </div>
  );
}

export default App;
