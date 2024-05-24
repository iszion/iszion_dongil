import { Notify } from 'quasar';

Notify.registerType('my-notify', {
  icon: 'announcement',
  progress: true,
  color: 'brown',
  textColor: 'white',
  classes: 'glossy',
});

const notifyAlerts = [
  {
    color: 'positive',
    message: '자료를 저장하였습니다',
    caption: '자료수정',
    icon: 'thumb_up',
    type: 'positive',
    textColor: 'dark',
  },
  {
    color: 'primary',
    message: '자료를 저장하였습니다',
    caption: '신규자료 추가',
    icon: 'thumb_up',
    type: 'positive',
    textColor: 'white',
  },
  {
    color: 'info',
    message: '자료를 저장하였습니다',
    caption: '선택된 자료삭제',
    icon: 'thumb_up',
    type: 'positive',
    textColor: 'red',
  },
  { color: 'negative', message: '저장실패!', caption: 'error', icon: 'warning', type: 'negative', textColor: '' },
  { color: 'teal', message: '관리자에게 문의하세요!', caption: 'error', icon: 'tag_faces', type: 'warning', textColor: '' },
  {
    multiLine: true,
    message:
      'Lorem ipsum dolor sit amet, consecrate radicalising elite. Hic squamous non ad sit assume consequent ease inventory official. Corrupt cisgendered impeded vel, fugit edit squamous qua poor excitation event quasi.',
  },
];

export default {
  notifyView(res) {
    // console.log('res: ', JSON.stringify(res));
    Notify.create({
      type: 'my-notify',
      position: 'top-right',
      color: notifyAlerts[res.rtn].color,
      textColor: notifyAlerts[res.rtn].textColor,
      caption: res.rtn2,
      message: res.rtn1,
      group: false,
      actions: [
        {
          label: '닫기',
          color: 'dark',
          handler: () => {
            /* ... */
          },
        },
      ],
      timeout: 5000,
    });
  },
};