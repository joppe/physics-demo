import { Chronometer } from './Chronometer';

export interface Animatable {
    (chronometer?: Chronometer): boolean;
}
