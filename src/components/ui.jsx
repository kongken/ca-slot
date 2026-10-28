import { useRef } from 'react';
import { cn } from '../utils.js';

export function Badge({ children, tone = 'blue', className }) { return <span className={cn('badge', `badge-${tone}`, className)}>{children}</span>; }
export function Button({ children, variant = 'primary', className, ...props }) { return <button className={cn('button', `button-${variant}`, className)} {...props}>{children}</button>; }
export function Card({ children, className }) { return <div className={cn('card', className)}>{children}</div>; }
export function Select({ className, ...props }) { return <span className={cn('select-wrap', className)}><select {...props} /></span>; }

export function Tabs({ items, value, onChange, label }) {
  const refs = useRef([]);
  const move = (index) => {
    const next = Math.max(0, Math.min(items.length - 1, index));
    onChange(items[next][0]);
    refs.current[next]?.focus();
  };
  const onKeyDown = (event, index) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); move(index + 1); }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); move(index - 1); }
    if (event.key === 'Home') { event.preventDefault(); move(0); }
    if (event.key === 'End') { event.preventDefault(); move(items.length - 1); }
  };
  return <div className="tabs-field"><span>{label}</span><div className="tabs" role="radiogroup" aria-label={label}>{items.map(([key, text], index) => <button key={key} ref={(element) => { refs.current[index] = element; }} type="button" role="radio" aria-checked={value === key} tabIndex={value === key ? 0 : -1} className={value === key ? 'tab is-active' : 'tab'} onClick={() => onChange(key)} onKeyDown={(event) => onKeyDown(event, index)}>{text}</button>)}</div></div>;
}
