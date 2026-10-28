import { cn } from '../utils.js';

export function Badge({ children, tone = 'blue', className }) { return <span className={cn('badge', `badge-${tone}`, className)}>{children}</span>; }
export function Button({ children, variant = 'primary', className, ...props }) { return <button className={cn('button', `button-${variant}`, className)} {...props}>{children}</button>; }
export function Card({ children, className }) { return <div className={cn('card', className)}>{children}</div>; }
export function Select({ className, ...props }) { return <span className={cn('select-wrap', className)}><select {...props} /></span>; }
export function Tabs({ items, value, onChange, label }) { return <div className="tabs-field"><span>{label}</span><div className="tabs" role="tablist" aria-label={label}>{items.map(([key, text]) => <button key={key} type="button" role="tab" aria-selected={value === key} className={value === key ? 'tab is-active' : 'tab'} onClick={() => onChange(key)}>{text}</button>)}</div></div>; }
