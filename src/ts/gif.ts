import '../css/pulsar.scss';

import './lib/random-example';
import './lib/debug';

import { Pulsar } from './lib/pulsar';
import { Editor } from './lib/editor';
import { Radio } from './lib/radio';
import { randomExample } from './lib/examples';

import { GifRecorder } from './lib/gif';

new Radio('grid', ['classic', 'hex', 'triangular'], randomExample.grid || '');
new Radio('animate', ['scale', 'opacity', 'both'], randomExample.animate || '');

new Editor();

const pulsar = new Pulsar();

new GifRecorder(pulsar);
