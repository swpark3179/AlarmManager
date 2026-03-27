import { Alarm } from '../types';

export const formatSchedule = (alarm: Alarm): string => {
  if (!alarm.triggers || alarm.triggers.length === 0) return 'No schedule';
  
  const type = alarm.repeat_type;
  if (type === 'None') {
    const ts = alarm.triggers;
    if (ts.length === 1) {
      return `${ts[0].date} ${ts[0].time}`;
    }
    return `${ts.length} dates`;
  }

  if (type === 'Daily') {
    return `Daily at ${alarm.triggers[0].time}`;
  }

  if (type === 'Weekly') {
    const t = alarm.triggers[0];
    return `Weekly on ${t.days_of_week?.join(', ')} at ${t.time}`;
  }

  if (type === 'Monthly') {
    const t = alarm.triggers[0];
    return `Monthly on the ${t.weeks_of_month} ${t.days_of_week?.[0]} at ${t.time}`;
  }

  return 'Unknown schedule';
};
