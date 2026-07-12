import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// ✅ ADD THIS PART (Chart.js imports)
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  PieController,
  ArcElement,
  BarController,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

// ✅ REGISTER CHART COMPONENTS
ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  PieController,
  ArcElement,
  BarController,
  BarElement,
  Tooltip,
  Legend
);

// Bootstrap Angular app
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));