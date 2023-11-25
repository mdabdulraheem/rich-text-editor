import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

const Title = (props: Props) => {
    const { children } = props;
    return (
        <h1 className="text-white text-2xl font-bold text-left sm:text-4xl sm:text-center">
            {children}
        </h1>
    );
};

export default Title;
