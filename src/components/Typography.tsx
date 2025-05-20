import React, { FC } from 'react';
import classNames from 'classnames';

interface TypographyProps {
    variant?: 'h1' | 'h2' | 'h3' | 'body1' | 'body2' | 'label';
    component?: React.ElementType;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties | object; // Extended style prop
    htmlFor?: string,
}

const variantStyles: Record<NonNullable<TypographyProps['variant']>, string> = {
    h1: 'text-5xl font-bold',
    h2: 'text-4xl font-semibold',
    h3: 'text-3xl font-semibold',
    body1: 'text-base',
    body2: 'text-sm',
    'label': ''
};

const Typography: FC<TypographyProps> = ({
    variant = 'body1',
    component: Component = 'p',
    children,
    className,
    style,
    htmlFor
}) => {
    return (
        <Component
            htmlFor={htmlFor}
            className={classNames(variantStyles[variant], className)}
            style={{

                color: '#404063',


                ...style
            }}
        >
            {children}
        </Component>
    );
};

export default Typography;
