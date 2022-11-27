import './App.css';
import React from 'react';
import { getDatabase, ref, set, child, get, update, remove } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import SingleTask from './SingleTask';
import CreateTask from './CreateTask';

function App() {
  const [tasks, setTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const firebaseConfig = {
    databaseURL: 'https://todolist-bd7b3-default-rtdb.europe-west1.firebasedatabase.app/',
  };
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  async function getTasks() {
    const dbRef = ref(getDatabase(app));
    await get(child(dbRef, 'tasks/')).then((obj) => {
      setTasks(Object.entries(obj.val()).map((item) => item[1]));
      setLoading(false);
    });
  }

  function deleteTask(task) {
    remove(ref(db, 'tasks/' + task)).then(getTasks());
  }

  function completeStatus(task, status) {
    update(ref(db, 'tasks/' + task + '/'), {
      status: status == 'completed' ? 'active' : 'completed',
    }).then(getTasks());
  }

  function writeUserData(task, info, date, attachments) {
    set(ref(db, 'tasks/' + task), {
      date: date,
      task: task,
      info: info,
      props: attachments,
      status: 'active',
    });
  }

  function expiredStatus(status, task) {
    update(ref(db, 'tasks/' + task + '/'), {
      status: status,
    }).then(getTasks);
  }

  React.useEffect(() => {
    setLoading(true);
    setTimeout(getTasks, 1000);
  }, []);

  return (
    <div className='app'>
      <div className='header'>
        <h1>Todo List</h1>
      </div>
      <div className='list'>
        {loading == true ? (
          <div className='loading'>
            <h1>ЗАГРУЗКА...</h1>
          </div>
        ) : (
          <div>
            <CreateTask getTasks={() => getTasks()} />
            {tasks &&
              tasks.map((item) => {
                return (
                  <SingleTask
                    expiredStatus={(status, task) => expiredStatus(status, task)}
                    writeUserData={(task, info, date, attachments) =>
                      writeUserData(task, info, date, attachments)
                    }
                    completeStatus={(item, status) => completeStatus(item, status)}
                    deleteTask={(item) => deleteTask(item)}
                    loading={() => setLoading(true)}
                    stop={() => setLoading(false)}
                    getTasks={() => getTasks()}
                    key={item.id}
                    task={item.task}
                    info={item.info}
                    date={item.date}
                    props={item.props}
                    status={item.status}
                  />
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
{
  /* <div key={item.task} className='singleTask'>
                //   <h3 className='task'>{item.task}</h3>
                //   <p className='taskInfo'>{item.info}</p>
                //   <p className='taskDate'>{item.date}</p>
                //   <div className='taskAttachments'>{item.attachments}</div>
                // </div> */
}
