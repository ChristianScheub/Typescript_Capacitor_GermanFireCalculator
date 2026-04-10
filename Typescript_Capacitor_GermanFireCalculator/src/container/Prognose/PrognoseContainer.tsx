import { PrognoseContentContainer } from './PrognoseContentContainer';
import type { PrognoseConfig } from '../../types/prognose/PrognoseConfig';

interface Props {
  config: PrognoseConfig;
}

export function PrognoseContainer({ config }: Props) {
  return <PrognoseContentContainer config={config} />;
}
