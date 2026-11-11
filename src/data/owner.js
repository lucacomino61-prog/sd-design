// What only the owner knows: the contact details, who answers, the legal details, the address of the site and the
// search-engine codes. The values are in owner.json, which the admin tool writes (it is a separate program, kept in
// its own folder and never part of this site); the file can also be filled in by hand. Nothing is guessed: what is
// not known yet is null, and the site shows nothing in its place.
import file from './owner.json' with { type: 'json' };

const env = typeof process !== 'undefined' ? process.env : {};

// OWNER_SAMPLE='{"contact":{...}}' in front of a build stands in for the file, so a filled-in site can be checked
// without writing test values into it (node tools/owner-check.mjs does exactly that).
export const owner = env.OWNER_SAMPLE ? JSON.parse(env.OWNER_SAMPLE) : file;
