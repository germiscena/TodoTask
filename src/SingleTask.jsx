import React from 'react';
import dayjs from 'dayjs';

const SingleTask = (item) => {
  const [isEdit, setIsEdit] = React.useState(false);
  let thisDay = dayjs().format('YYYY-MM-DD');
  let taskDay = item.date;
  const checkedRef = React.useRef(false);
  let singleClassName =
    item.status == 'expired'
      ? 'singleTask expired'
      : item.status == 'completed'
      ? 'singleTask completed'
      : 'singleTask';

  let expiredState = item.status;
  item.status !== 'completed'
    ? new Date(taskDay) >= new Date(thisDay)
      ? (expiredState = item.status)
      : (expiredState = 'expired')
    : (expiredState = 'completed');

  React.useEffect(() => {
    item.expiredStatus(expiredState, item.task);
  }, []);

  const editName = React.useRef('a');
  const editInfo = React.useRef('d');
  const editDate = React.useRef('c');
  const editAttachments = React.useRef('h');
  //редактирование задания, task - задание , name - название , info - информация, date - дата, attachments - вложения
  function updateTask(task, name, info, date, attachments) {
    item.deleteTask(task);
    item.writeUserData(name, info, date, attachments);
    setIsEdit(false);
    item.getTasks();
  }

  return (
    <div className={singleClassName} key={item.task}>
      {item.status == 'expired' ? (
        <input ref={checkedRef} type='checkbox' disabled />
      ) : item.status == 'completed' ? (
        <input
          ref={checkedRef}
          onChange={() => item.completeStatus(item.task, item.status)}
          type='checkbox'
          defaultChecked
        />
      ) : (
        <input
          ref={checkedRef}
          onChange={() => item.completeStatus(item.task, item.status)}
          type='checkbox'
        />
      )}
      {item.status == 'expired' || item.status == 'completed' ? (
        <>
          <h3 className='task'>{item.task}</h3>
          <p className='taskInfo'>{item.info}</p>
          <p className='taskDate'>{item.date}</p>
          <p className='taskAttachments'>{item.props}</p>
        </>
      ) : isEdit == true ? (
        <>
          <input ref={editName} placeholder='задание' type='text' className='task' />
          <input ref={editInfo} placeholder='информация' type='text' className='editInfo' />
          <input ref={editDate} placeholder='дата' type='date' className='taskDate' />
          <input ref={editAttachments} type='file' className='taskFile' />
        </>
      ) : (
        <>
          <h3 className='task'>{item.task}</h3>
          <p className='taskInfo'>{item.info}</p>
          <p className='taskDate'>{item.date}</p>
          <p className='taskAttachments'>{item.props}</p>
        </>
      )}
      {item.status == 'active' ? (
        isEdit ? (
          <p
            className='taskEdit'
            onClick={() =>
              updateTask(
                item.task,
                editName.current.value,
                editInfo.current.value,
                editDate.current.value,
                editAttachments.current.value,
              )
            }>
            ✓
          </p>
        ) : (
          <p className='taskEdit' onClick={() => setIsEdit(true)}>
            ✎
          </p>
        )
      ) : (
        <></>
      )}
      <p className='taskDelete' onClick={() => item.deleteTask(item.task)}>
        ✕
      </p>
    </div>
  );
};
export default SingleTask;
