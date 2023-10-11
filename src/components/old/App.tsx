import { useState } from 'react';
import '../App.css'
import Alert from "./Alert";
import Button from "./Button";
import Header from './Header';

function App() {
   const item = ['foo', 'bar']
   const [alertVisible, setAlertVisible] = useState(false)
   const handleSelectItem = (item: string) => {
      console.log(item)
   }

   return(
      <div>
         <Button onClick={() => setAlertVisible(true)}>
            Foo
         </Button>
         {alertVisible && <Alert onClose={() => setAlertVisible(false)}> FOO</Alert>}
         <Header items={item} header='Foo' onSelectItem={handleSelectItem} />

      </div>
   )
}

export default App;
