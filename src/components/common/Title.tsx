import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

const Title = (props: Props) => {
    const { children } = props;
    return <h1 className="text-white text-2xl font-bold text-center sm:text-4xl ">{children}</h1>;
};

export default Title;
