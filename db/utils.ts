export function formatDate(dateString: string): string {
  if (!dateString || !dateString.includes('-')) return dateString;
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const [year, month, day] = parts;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIndex = parseInt(month) - 1;
  if (monthIndex < 0 || monthIndex > 11) return dateString;
  return `${parseInt(day)} ${months[monthIndex]} ${year}`;
}
