import * as sodium from 'sodium-native';

export function hashPassword(password: string): string {
    const passwordBuffer = Buffer.from(password, 'utf8');
    const hashBuffer = Buffer.alloc(sodium.crypto_pwhash_STRBYTES);
    sodium.crypto_pwhash_str(
        hashBuffer,
        passwordBuffer,
        sodium.crypto_pwhash_OPSLIMIT_MODERATE,
        sodium.crypto_pwhash_MEMLIMIT_MODERATE,
    );
    return hashBuffer.toString('utf8');
};

export function verifyPassword(password: string, storedHash: string): boolean {
    const passwordBuffer = Buffer.from(password, 'utf8');
    const storedHashBuffer = Buffer.from(storedHash, 'utf8');
    return sodium.crypto_pwhash_str_verify(storedHashBuffer, passwordBuffer);
};