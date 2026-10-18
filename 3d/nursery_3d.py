import os
import sys
import math
import argparse
from math import sin, cos, pi

try:
    import bpy
except ImportError:
    print('This script must be run inside Blender.')
    raise

parser = argparse.ArgumentParser()
parser.add_argument('--output', default='output/3d_nursery.mp4')
args, unknown = parser.parse_known_args(sys.argv)

OUTPUT_PATH = args.output

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE'
scene.eevee.use_gtao = True
scene.eevee.use_bloom = True
scene.render.film_transparent = False
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.fps = 30
scene.frame_start = 1
scene.frame_end = 180
scene.world.color = (0.74, 0.90, 1.0, 1.0)

# create stage
stage = bpy.data.objects.new('Stage', bpy.data.meshes.new('StageMesh'))

# simple ground plane
bpy.ops.mesh.primitive_plane_add(size=40, location=(0, 0, 0))
plane = bpy.context.active_object
plane.name = 'Ground'
plane.scale = (8, 6, 1)
mat = bpy.data.materials.new(name='GroundMat')
mat.use_nodes = True
mat.node_tree.nodes["Principled BSDF"].base_color = (0.42, 0.78, 0.35, 1.0)
plane.data.materials.append(mat)

# helper function to create a simple stylized animal

def create_animal(name, scale, color, location):
    animals = []
    body = bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=16, radius=1.0, location=location)
    body_obj = bpy.context.active_object
    body_obj.name = name + '_body'
    body_obj.scale = (1.4, 1.1, 1.0)
    body_obj.data.materials.append(material_for(color))
    animals.append(body_obj)

    head = bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=16, radius=0.75, location=(location[0] + 1.6, location[1], location[2] + 0.45))
    head_obj = bpy.context.active_object
    head_obj.name = name + '_head'
    head_obj.scale = (1.0, 0.98, 0.95)
    head_obj.data.materials.append(material_for((0.98, 0.95, 0.92, 1.0)))
    animals.append(head_obj)

    # ears
    for offset in (-0.7, 0.7):
        ear = bpy.ops.mesh.primitive_cone_add(vertices=8, radius1=0.18, radius2=0.06, depth=0.8, location=(location[0] + 1.6 + offset * 0.35, location[1], location[2] + 1.1))
        ear_obj = bpy.context.active_object
        ear_obj.rotation_euler = (0.0, 0.0, offset * 0.7)
        ear_obj.data.materials.append(material_for((0.94, 0.88, 0.78, 1.0)))
        animals.append(ear_obj)

    # legs
    leg_positions = [(-0.6, -0.6), (0.6, -0.6), (-0.6, 0.6), (0.6, 0.6)]
    for x, y in leg_positions:
        leg = bpy.ops.mesh.primitive_cylinder_add(radius=0.15, depth=1.2, location=(location[0] + x, location[1] + y, location[2] - 1.1))
        leg_obj = bpy.context.active_object
        leg_obj.data.materials.append(material_for((0.16, 0.16, 0.16, 1.0)))
        animals.append(leg_obj)

    # eyes
    for sign in (-1, 1):
        eye = bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=8, radius=0.12, location=(location[0] + 1.78 + sign * 0.35, location[1] + 0.25, location[2] + 0.5))
        eye_obj = bpy.context.active_object
        eye_obj.data.materials.append(material_for((0.08, 0.08, 0.08, 1.0)))
        animals.append(eye_obj)

    # nose
    snout = bpy.ops.mesh.primitive_uv_sphere_add(segments=10, ring_count=8, radius=0.12, location=(location[0] + 2.15, location[1], location[2] + 0.35))
    snout_obj = bpy.context.active_object
    snout_obj.scale = (1.0, 1.1, 0.8)
    snout_obj.data.materials.append(material_for((0.96, 0.75, 0.85, 1.0)))
    animals.append(snout_obj)

    # set scale
    for obj in animals:
        obj.scale *= scale

    return animals


def material_for(color):
    mat = bpy.data.materials.new(name=f'Mat_{str(color)}')
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = color
    return mat


# create background props
sun = bpy.ops.mesh.primitive_uv_sphere_add(segments=40, ring_count=20, radius=1.8, location=(7, 8, 5))
sun_obj = bpy.context.active_object
sun_obj.data.materials.append(material_for((1.0, 0.84, 0.35, 1.0)))

cloud_positions = [(-5.5, 5.0, 3.0), (2.3, 6.0, 3.8), (8.0, 4.8, 3.5)]
for pos in cloud_positions:
    cloud = bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=10, radius=1.1, location=pos)
    obj = bpy.context.active_object
    obj.scale = (1.9, 1.0, 0.7)
    obj.data.materials.append(material_for((0.98, 0.98, 0.98, 1.0)))

# create multiple animals
farm_animals = [
    create_animal('cow', 1.0, (0.96, 0.96, 0.96, 1.0), (-3.0, -1.0, 1.0)),
    create_animal('pig', 1.0, (0.98, 0.68, 0.76, 1.0), (-0.2, -1.2, 1.0)),
    create_animal('chicken', 0.9, (1.0, 0.88, 0.63, 1.0), (2.8, -0.5, 1.1)),
    create_animal('duck', 0.9, (0.94, 0.77, 0.16, 1.0), (5.0, -0.3, 1.0)),
]

# animate the animals
for frame_index, _ in enumerate(range(scene.frame_start, scene.frame_end + 1), start=scene.frame_start):
    scene.frame_set(frame_index)
    for i, animal_group in enumerate(farm_animals):
        for obj in animal_group:
            obj.location.x += 0.008 * sin(frame_index / 12 + i)
            obj.location.y += 0.01 * cos(frame_index / 10 + i)
            obj.rotation_euler.z = sin(frame_index / 12 + i) * 0.08
            obj.keyframe_insert(data_path='location', index=-1)
            obj.keyframe_insert(data_path='rotation_euler', index=2)

# camera
bpy.ops.object.camera_add(location=(0, -10.5, 4.5), rotation=(1.2, 0, 0))
camera = bpy.context.object
camera.name = 'MainCamera'
camera.data.lens = 35
goal = bpy.data.object.new('CameraTarget', None)
goal.location = (0, 0, 1.5)
scene.collection.objects.link(goal)
constraint = camera.constraints.new(type='TRACK_TO')
constraint.target = goal
constraint.track_axis = 'TRACK_NEGATIVE_Z'
constraint.up_axis = 'UP_Y'

# lighting
lamp_data = bpy.data.lights.new(name='KeyLight', type='AREA')
lamp_data.energy = 3000
lamp = bpy.data.objects.new(name='KeyLight', object_data=lamp_data)
scene.collection.objects.link(lamp)
lamp.location = (6, -5, 7)

lamp_data2 = bpy.data.lights.new(name='FillLight', type='AREA')
lamp_data2.energy = 1800
lamp2 = bpy.data.objects.new(name='FillLight', object_data=lamp_data2)
scene.collection.objects.link(lamp2)
lamp2.location = (-7, -6, 7)

scene.camera = camera
scene.render.filepath = OUTPUT_PATH
scene.render.image_settings.file_format = 'FFMPEG'
scene.render.ffmpeg.format = 'MPEG4'
scene.render.ffmpeg.codec = 'H264'
scene.render.ffmpeg.audio_codec = 'AAC'

# render
bpy.ops.render.render(animation=True)
