import React from 'react';
import { getDatabase, ref, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';

const CreateTask = ({ getTasks }) => {
  const firebaseConfig = {
    databaseURL: 'https://todolist-bd7b3-default-rtdb.europe-west1.firebasedatabase.app/',
  };
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  //создание нового задания, task - задание, info - информация , date - дата , attachments - вложения
  function writeUserData(task, info, date, attachments) {
    set(ref(database, 'tasks/' + task), {
      date: date,
      task: task,
      info: info,
      props: attachments,
      status: 'active',
    });
  }
  const refTask = React.useRef('');
  const refInfo = React.useRef('');
  const refDate = React.useRef('');
  const refProp = React.useRef('');
  //создание задания с введенными данными
  function send() {
    const inputTask = refTask.current;
    const inputInfo = refInfo.current;
    const inputDate = refDate.current;
    const inputProp = refProp.current;
    if (inputInfo.value !== '' && inputTask.value !== '') {
      writeUserData(inputTask.value, inputInfo.value, inputDate.value, inputProp.value);
      setTimeout(getTasks, 1000);
    }
  }
  return (
    <div className='singleTask'>
      <input ref={refTask} className='inputTask' type='text' placeholder='задание' />
      <input ref={refInfo} className='inputText' type='text' placeholder='информация' />
      <input ref={refDate} className='inputDate' type='date' />
      <input ref={refProp} type='file' />
      <button className='sendTask' onClick={() => send()}>
        отправить
      </button>
    </div>
  );
};
export default CreateTask;
