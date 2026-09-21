const { PERIOD_TIMES } = require('../../data/defaults');
const {
  loadSettings,
  resetAll,
  saveCourses,
  saveSettings
} = require('../../utils/storage');

Page({
  data: {
    settings: {},
    totalWeekOptions: Array.from({ length: 30 }, (_, index) => index + 1),
    totalWeekIndex: 17
  },

  onLoad() {
    const settings = loadSettings();
    this.setData({
      settings,
      totalWeekIndex: Math.max(0, Number(settings.totalWeeks) - 1)
    });
  },

  updateName(event) {
    this.setData({ 'settings.timetableName': event.detail.value });
  },

  updateStartDate(event) {
    this.setData({ 'settings.semesterStartMonday': event.detail.value });
  },

  updateTotalWeeks(event) {
    const totalWeekIndex = Number(event.detail.value);
    this.setData({ totalWeekIndex, 'settings.totalWeeks': totalWeekIndex + 1 });
  },

  toggleWeekend(event) {
    this.setData({ 'settings.showWeekend': event.detail.value });
  },

  updatePeriod(event) {
    const index = Number(event.currentTarget.dataset.index);
    const field = event.currentTarget.dataset.field;
    this.setData({ [`settings.periodTimes[${index}].${field}`]: event.detail.value });
  },

  restorePeriodTimes() {
    this.setData({ 'settings.periodTimes': JSON.parse(JSON.stringify(PERIOD_TIMES)) });
    wx.showToast({ title: '已恢复默认作息', icon: 'none' });
  },

  save() {
    const settings = this.data.settings;
    if (!String(settings.timetableName || '').trim()) {
      wx.showToast({ title: '请填写课表名称', icon: 'none' });
      return;
    }
    saveSettings(settings);
    wx.showToast({ title: '设置已保存', icon: 'success' });
    setTimeout(() => wx.navigateBack(), 400);
  },

  resetDemo() {
    wx.showModal({
      title: '恢复示例课表？',
      content: '现有课表和设置会被示例数据覆盖，操作无法撤销。',
      confirmText: '恢复',
      confirmColor: '#d94747',
      success: (result) => {
        if (!result.confirm) return;
        resetAll();
        wx.showToast({ title: '已恢复示例课表', icon: 'success' });
        setTimeout(() => wx.reLaunch({ url: '/pages/timetable/index' }), 400);
      }
    });
  },

  clearCourses() {
    wx.showModal({
      title: '清空全部课程？',
      content: '所有课程都会从本机删除，课表设置会保留。该操作无法撤销。',
      confirmText: '清空',
      confirmColor: '#d94747',
      success: (result) => {
        if (!result.confirm) return;
        saveCourses([]);
        wx.showToast({ title: '课程已清空', icon: 'success' });
        setTimeout(() => wx.reLaunch({ url: '/pages/timetable/index' }), 400);
      }
    });
  }
});

