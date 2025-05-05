// imports
import * as React from 'react';
// project
import { cn } from '@/lib/utils';
// components
import { UList, ListTile } from './list-tile';

export type RenderItemHandler<T = any> = (
  item?: T | null,
  index?: number,
  opts?: {
    onItemClick?: () => void;
    onItemHover?: () => void;
    onItemDelete?: () => void;
  }
) => React.ReactNode;

type ListManagerProps<T = any> = {
  className?: string;
  description?: React.ReactNode;
  title?: React.ReactNode;
  values?: T[] | null;
  onItemClick?: (item?: T | null) => void;
  onItemHover?: (item: T) => void;
  onItemDelete?: (item: T) => void;
  renderItem: RenderItemHandler<T>;
};

type ListContext<T = any> = {
  values: T[];
  onItemChange?: (item?: T | null) => void;
};

const ListContext = React.createContext<ListContext<any>>({
  values: [],
});

export const useDataList = () => {
  const context = React.useContext(ListContext);
  if (!context) {
    throw new Error('useListContext must be used within a ListProvider');
  }
  return context;
};

type ProviderProps<T = any> = {
  defaultValues?: T[];
}
export function DataListProvider<TData>({ children, className, ref, defaultValues = [], ...props }: Readonly<React.PropsWithChildren<React.ComponentPropsWithRef<'div'> & ProviderProps<TData>>>) {
    const [_data, _setData] = React.useState<TData[]>(defaultValues);

    // redeclare stateful variables
    const values = _data;
    const setValues = _setData;
    // memoize the values to avoid unnecessary re-renders
    const context = React.useMemo(() => ({ values, setValues }), [values, setValues]);
    return (
      <ListContext.Provider value={context}>
        <div ref={ref} className={cn('flex flex-col w-full', className)} {...props}>
        {children}
      </div>
      </ListContext.Provider>

    );
  }
DataListProvider.displayName = 'DataListProvider';

export const ListManager: React.FC<ListManagerProps> = ({
  className,
  description,
  title,
  onItemClick,
  onItemDelete,
  onItemHover,
  renderItem
}) => {
  const { values } = useDataList();
  return (
    <div className={cn('flex flex-col w-full', className)}>
      <section className="flex flex-col w-full mb-4">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </section>
      <section className="flex fle">
        <UList>
          {values?.map((item, index) => (
            <ListTile key={index} onClick={() => onItemClick?.(item)}>
              {renderItem(item, index, {
                onItemClick: () => onItemClick?.(item),
                onItemDelete: () => onItemDelete?.(item),
                onItemHover: () => onItemHover?.(item),
              })}
            </ListTile>
          ))}
        </UList>
      </section>
    </div>
  );
};

export const ListManagerView: React.FC<
  Omit<React.ComponentPropsWithRef<typeof ListManager>, 'children'> &
  ListManagerProps
> = ({
  ...props}) => {
    return (
      <DataListProvider className="flex-1 w-full">
        <ListManager {...props} />
      </DataListProvider>
    )
  }