FROM nginx:1.21.6-alpine AS build
COPY dist  /usr/share/nginx/tmp

FROM build AS production
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

FROM build AS sandbox
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

FROM build AS testing
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

FROM build AS development
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

