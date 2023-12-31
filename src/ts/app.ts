import '../css/pulsar.scss';

import './lib/share-button';
import './lib/random-example';
import './lib/debug';

import { Pulsar } from './lib/pulsar';
import { Editor } from './lib/editor';
import { Radio } from './lib/radio';
import { Tutorial } from './lib/tutorial';
import { randomExample } from './lib/examples';

new Radio('grid', ['classic', 'hex', 'triangular'], randomExample.grid || '');
new Radio('animate', ['scale', 'opacity', 'both'], randomExample.animate || '');

new Editor();

const pulsar = new Pulsar();

new Tutorial(pulsar);
