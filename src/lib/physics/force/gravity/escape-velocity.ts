import { GRAVITATIONAL_CONSTANT } from './gravitational-constant';

export function escapeVelocity(mass: number, distance: number, G: number = GRAVITATIONAL_CONSTANT): number {
    return Math.sqrt(
        (G * mass * 2) / distance,
    );
}
